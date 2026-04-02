import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

interface AccessTokenPayload {
    id: number;
    email: string;
    role: string;
}

export function generateAccessToken(payload: AccessTokenPayload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}