import type { CreateNewUserInput } from "../validators/user/user.validator.js";
import { findUserByEmail } from "../repositories/user.repository.js";
import { NotFoundError, UnauthorizedError } from "../utils/errors/app.error.js";
import { getRole } from "../repositories/role.repository.js";
import { hashPassword } from "../utils/password.js";
import { createUser } from "../repositories/user.repository.js";
import { comparePassword } from "../utils/password.js";
import { generateAccessToken } from "../utils/jwt.js";
import type { LoginUserInput } from "../validators/user/user.validator.js";

export const registerationService = async (data: CreateNewUserInput) => {
    const isExistingUser = await findUserByEmail(data.email);
    if (isExistingUser) {
        throw new NotFoundError("User with this email already exists");
    }
    const isRoleExist = await getRole(data.role);
    if (!isRoleExist) {
        throw new NotFoundError("Role not found");
    }
    const hashedPassword = await hashPassword(data.password);
    const user = await createUser({ ...data, password: hashedPassword }, isRoleExist.id);
    return user;
}

export const loginUserService = async (data: LoginUserInput) => {
    const user = await findUserByEmail(data.email);
    if (!user) {
        throw new UnauthorizedError("Invalid credentials");
    }
    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid credentials");
    }
    const token = generateAccessToken({ id: user.id, email: user.email });
    return { user, token };
}
