import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET;

if (!JWT_SECRET) {
    throw new Error("Please define the NEXTAUTH_SECRET environment variable.");
}

export function signToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET as string, { expiresIn: "1d" });
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET as string);
    } catch (error) {
        return null;
    }
}
