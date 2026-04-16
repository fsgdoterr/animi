import { cookies } from "next/headers";

const sessionCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
};

export async function setSessionCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
        ...sessionCookieOptions,
        maxAge: 60 * 60 * 24 * 7,
    });
}

export async function clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.set("session", "", {
        ...sessionCookieOptions,
        maxAge: 0,
    });
}
