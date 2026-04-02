export class UserResponseDto {
    id: string;
    name: string;
    email: string;
    age: number;
    role: string;

    private constructor(user: any) {
        this.id = user.users_table.uuid;
        this.name = user.users_table.name;
        this.email = user.users_table.email;
        this.age = user.users_table.age;
        this.role = user.roles_table.name;
    }

    static fromUser(user: any): UserResponseDto {
        return new UserResponseDto(user);
    }
}
