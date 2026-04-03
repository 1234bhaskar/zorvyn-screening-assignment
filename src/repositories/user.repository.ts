import { db } from "../db/index.db.js";
import { Users, Roles } from "../db/schema.js";
import { eq } from "drizzle-orm";
import type { CreateNewUserInput } from "../validators/user/user.validator.js";

export async function getUser(uuid: string) {
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

export async function getUserById(id: number) {
    try {
        const [user] = await db.select()
            .from(Users)
            .where(eq(Users.id, id));
        return user;
    } catch (error) {
        console.log("Error fetching user details", error);
        throw error;
    }
}

export async function userProfile(id: number) {
    try {
        const [user] = await db.select()
            .from(Users)
            .leftJoin(Roles, eq(Users.role, Roles.id))
            .where(eq(Users.id, id));
        return user;
    } catch (error) {
        console.log("Error fetching user details", error);
        throw error;
    }
}


export async function findUserByEmail(email: string) {
    const [user] = await db.select()
        .from(Users)
        .leftJoin(Roles, eq(Users.role, Roles.id))
        .where(eq(Users.email, email));
    if (!user) {
        return null;
    }
    return user;
}

export async function createUser(data: CreateNewUserInput, roleId: number) {
    try {
        const [userRecord] = await db
            .insert(Users)
            .values({
                name: data.name,
                age: data.age,
                email: data.email,
                password: data.password,
                role: roleId,
            })
            .returning();

        if (!userRecord) {
            throw new Error("User not created");
        }

        return userRecord;
    } catch (error: any) {
        console.error("DATABASE_ERROR_DETAIL:", error.detail || error.message);
        throw error;
    }
}


export const updateUserStatus = async (id: number, status: boolean): Promise<boolean> => {
    try {
        await db.update(Users)
            .set({ isActive: status })
            .where(eq(Users.id, id))
            .returning();
        return true;
    } catch (error) {
        console.log("Error updating user status", error);
        throw error;
    }
}
