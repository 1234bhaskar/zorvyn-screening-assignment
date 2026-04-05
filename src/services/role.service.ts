import { ConflictError, NotFoundError } from "../utils/errors/app.error.js";
import { createRole, getAllRoles, getRole } from "../repositories/role.repository.js";
import type { CreateRoleInput } from "../interface/role.interface.js";
import { sanitizeString } from "../utils/string.js";
import type { Role } from "../constant/role.js";

export const addNewRoleService = async (data: CreateRoleInput) => {
    const sanitizedName = sanitizeString(data.name);
    const isExistingRole = await getRole(sanitizedName);
    if (isExistingRole) {
        throw new ConflictError("Role with this name already exists");
    }
    const role = await createRole(sanitizedName);
    return role;
}

export const getAllRolesService = async () => {
    const roles = await getAllRoles();
    return roles;
}

export const getRoleService = async (roleName: Role) => {
    const role = await getRole(roleName);
    if (!role) {
        throw new NotFoundError("Role not found");
    }
    return role;
}

