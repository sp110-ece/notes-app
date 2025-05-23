// import { Amplify } from "aws-amplify";

export const amplifyConfig = {
    Auth : {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
            userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
        }
    }
}