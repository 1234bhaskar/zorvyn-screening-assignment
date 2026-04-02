import { db } from "../db/index.db.js";
import { Users, Roles, userHasRoles, type SelectUser } from "../db/schema.js";
import { eq } from "drizzle-orm";
import type { CreateNewUserInput } from "../validators/user/user.validator.js";

export async function getUserDetails(uuid: string) {
    try {
        const [user] = await db.select()
            .from(Users)
            .where(eq(Users.uuid, uuid));
        return user;
    } catch (error) {
        console.log("Error fetching user details", error);
        throw error;
    }
}

export async function findUserByEmail(email: string): Promise<SelectUser | null> {
    const [user] = await db.select()
        .from(Users)
        .where(eq(Users.email, email));
    if (!user) {
        return null;
    }
    return user;
}

export async function createUser(data: CreateNewUserInput, roleId: number) {
    return await db.transaction(async (tx) => {
        try {
            const [userRecord] = await tx
                .insert(Users)
                .values({
                    name: data.name,
                    age: data.age,
                    email: data.email,
                    password: data.password,
                })
                .returning();

            if (!userRecord) {
                throw new Error("User not created");
            }

            await tx.insert(userHasRoles).values({
                userId: userRecord.id,
                roleId: roleId,
            });

            return userRecord;
        } catch (error: any) {
            console.error("DATABASE_ERROR_DETAIL:", error.detail || error.message);
            throw error;
        }
    });
}