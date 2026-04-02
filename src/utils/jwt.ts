import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateAccessToken(payload: any) {
    const accessPayload = { ...payload, tokenType: "access" };
    return jwt.sign(accessPayload, JWT_SECRET, { expiresIn: "15m" });
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}