import { boolean, integer, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const Roles = pgTable('roles_table', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export const Users = pgTable('users_table', {
    id: serial('id').primaryKey(),
    uuid: uuid("uuid").defaultRandom().notNull(),
    name: text('name').notNull(),
    age: integer('age').notNull(),
    email: text('email').notNull().unique(),
    role: integer('role_id').references(() => Roles.id),
    password: text('password').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});


export type InsertUser = typeof Users.$inferInsert;
export type SelectUser = typeof Users.$inferSelect;
export type InsertRole = typeof Roles.$inferInsert;
export type SelectRole = typeof Roles.$inferSelect;

