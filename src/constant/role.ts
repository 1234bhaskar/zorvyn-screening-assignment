const ROLES = {
    Admin: "admin",
    Analyst: "analyst",
    Viewer: "viewer",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export { ROLES };