import { db } from "../db/index.db.js";
import { Roles } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function getRole(name: string) {
    try {
        const [role] = await db.select()
            .from(Roles)
            .where(eq(Roles.name, name));
        return role;
    } catch (error) {
        console.log("Error fetching role by name", error);
        throw error;
    }
}

export async function getAllRoles() {
    try {
        const roles = await db.select().from(Roles);
        return roles;
    } catch (error) {
        console.log("Error fetching all roles", error);
        throw error;
    }
}

export async function createRole(name: string) {
    try {
        const [role] = await db.insert(Roles).values({ name }).returning();
        return role;
    } catch (error) {
        console.log("Error creating role", error);
        throw error;
    }
}