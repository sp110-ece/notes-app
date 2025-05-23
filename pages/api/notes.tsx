import type { NextApiRequest, NextApiResponse } from 'next';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from '@/lib/dynamodb'
import { jwtVerify } from 'jose';
import * as jose from 'jose';

const COGNITO_POOL_ID = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!;
const COGNITO_CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
const REGION = process.env.NEXT_PUBLIC_AWS_REGION!;

const getCognitoIssuer = (region: string, poolId: string) => `https://cognito-idp.${region}.amazonaws.com/${poolId}`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const jwks = jose.createRemoteJWKSet(new URL(`${getCognitoIssuer(REGION, COGNITO_POOL_ID)}/.well-known/jwks.json`));
        const { payload } = await jwtVerify(token, jwks, {
            issuer: getCognitoIssuer(REGION, COGNITO_POOL_ID),
            audience: COGNITO_CLIENT_ID,
        });

        const userID = payload.sub;

        const { ID, title, content } = req.body;
        if (!ID || !content || !title) {
            return res.status(400).json({ error: 'Missing nodeId or content' });
        }

        await ddbDocClient.send(new PutCommand({
            TableName: 'Notes',
            Item: {
                userID,
                ID,
                title,
                content,
                createdAt: Date.now()
            }


        }))
        res.status(200).json({ sucess: true });
    } catch (err) {
        console.error('Error verifying token or saving note: ', err);
        res.status(401).json({error: 'error writing note'});
    }
}