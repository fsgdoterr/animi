import { UserPermissions } from "@/lib/generated/prisma/enums";
import { jwtVerify, SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

if (!process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET is not set");
}

type SessionPayload = {
    id: number;
    email: string;
    username: string;
    permissions: UserPermissions[];
    createdAt: string | Date;
};

export async function signSession(payload: SessionPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
}

export async function verifySession(token: string) {
    const { payload } = await jwtVerify(token, secret);
    return payload as SessionPayload & { iat: number; exp: number };
}
