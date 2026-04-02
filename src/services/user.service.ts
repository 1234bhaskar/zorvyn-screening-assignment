import { UserResponseDto } from "../dto/user.dto.js";
import { getUser, updateUserStatus, userProfile } from "../repositories/user.repository.js";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error.js";

export const getUserService = async (uuid: string) => {
    const user = await getUser(uuid);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    return user;
}

export const showUserProfile = async (id: number) => {
    const user = await userProfile(id);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    return UserResponseDto.fromUser(user);
}

export const updateStatusService = async (uuid: string, status: string) => {
    const user = await getUser(uuid);
    if (!user) throw new NotFoundError("User not found");

    let shouldBeActive = true;
    if (status === "inactive") {
        shouldBeActive = false;
    }
    if (user.isActive === shouldBeActive) {
        throw new BadRequestError(`User is already ${status}`);
    }
    return await updateUserStatus(user.id, shouldBeActive);
};

