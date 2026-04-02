import { createUser, findUserByEmail, getUserDetails } from "../repositories/user.repository.js"
import { NotFoundError, UnauthorizedError } from "../utils/errors/app.error.js";
import type { CreateNewUserInput, LoginUserInput } from "../validators/user/user.validator.js"
import { comparePassword, hashPassword } from "../utils/password.js";
import { getRole } from "../repositories/role.repository.js";
import { generateAccessToken } from "../utils/jwt.js";


export const getUserService = async (uuid: string) => {
    const user = await getUserDetails(uuid);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    return user;
}

