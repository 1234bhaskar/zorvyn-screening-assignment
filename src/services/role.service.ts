import { ConflictError, NotFoundError } from "../utils/errors/app.error.js";
import { createRole, getRole } from "../repositories/role.repository.js";
import type { CreateRoleInput } from "../interface/role.interface.js";
import { sanitizeString } from "../utils/string.js";

export const addNewRoleService = async (data: CreateRoleInput) => {
    const sanitizedName = sanitizeString(data.name);
    const isExistingRole = await getRole(sanitizedName);
    if (isExistingRole) {
        throw new ConflictError("Role with this name already exists");
    }
    const role = await createRole(sanitizedName);
    return role;
}

// const getUserService = async (uuid: string) => {
//     const user = await getUserDetails(uuid);
//     if (!user) {
//         throw new NotFoundError("User not found");
//     }
//     return user;
// }

