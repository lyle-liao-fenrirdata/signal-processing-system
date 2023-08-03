import { JWTPayload, SignJWT, jwtVerify } from 'jose';

export interface UserJWTPayload extends JWTPayload, UserPayload { };

export interface UserPayload {
    username: string,
    role: string
}

// const secretKey = createSecretKey("process.env.JWT_SECRET", 'utf-8');
const secretKey = new TextEncoder().encode(
    "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
);

export async function signUserJWT({ username, role }: UserPayload) {
    return await new SignJWT({ username, role })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer("Fenrir Data Analysis")
        .setExpirationTime("1 day")
        .sign(secretKey);
}

export async function verifyUserJWT(token: string) {
    try {
        const verify = (await jwtVerify(token, secretKey)) as unknown as UserJWTPayload;
        return { verify }
    } catch (error) {
        return { error }
    }
}

export function getCookie(token: string) {
    const d = new Date();
    d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
    return `x-token=Bearer ${token}; Path=/; HttpOnly;expires=${d.toUTCString()};SameSite=Strict`
}

// export async function refreshUserJWT(oldToken: string) {
//     const { error, verify } = await verifyUserJWT(oldToken);
//     if (!verify) return { error };

//     const token = await signUserJWT(verify.payload as unknown as JWTPayload)
//     return {
//         token,
//         user: verify.payload
//     };
// }