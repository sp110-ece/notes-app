import { fetchAuthSession, signOut } from "aws-amplify/auth";
import SignOut from '@/pages/doSignOut';




export async function getAccessToken(): Promise<string | null> {
    try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString()

        if (!token) throw new Error("no access token found");
        return token;
    }
    catch (error) {
        console.error("failed to fetch session: ", error);
        await signOut();
        return null;
    }

}