import type { NextApiRequest, NextApiResponse } from 'next';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from '@/lib/dynamodb'
import { jwtVerify } from 'jose';
import * as jose from 'jose';
import { getAccessToken } from '@/lib/auth';

const COGNITO_POOL_ID = process.env.COGNITO_USER_POOL_ID!;
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID!;
const REGION = process.env.AWS_REGION!;

const getCognitoIssuer = (region: string, poolId: string) => `https://cognito-idp.${region}.amazonaws.com/${poolId}`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(405).end();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({error: 'missing or invalid authorization'})
    }

    const token = authHeader.split(' ')[1];

    try {
        const jwks = jose.createRemoteJWKSet(new URL(`${getCognitoIssuer(REGION, COGNITO_POOL_ID)}/.well-known/jwks.json`));
        const { payload } = await jwtVerify(token, jwks, {
            issuer: getCognitoIssuer(REGION, COGNITO_POOL_ID),
            audience: COGNITO_CLIENT_ID
        })

        const userID = payload.sub;
        
        const command = new QueryCommand({
            TableName: 'Notes',
            ExpressionAttributeValues: {
                ':uid': userID,
            },
            KeyConditionExpression: 'userID = :uid',
            ScanIndexForward: true,
        })
        
        const data = await ddbDocClient.send(command);
        return res.status(200).json(data.Items);
    }
    catch (err) {
        return res.status(500).json({error: 'Failed to fetch notes'});
    } 
}