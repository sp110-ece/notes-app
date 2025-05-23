import { Amplify } from "aws-amplify";

export const amplifyConfig = {
    Auth : {
        Cognito: {
            userPoolId: "us-east-2_R4loMxWtH",
            userPoolClientId: "1qeklab66fltmm0e1ipkjv5vpp"
        }
    }
}