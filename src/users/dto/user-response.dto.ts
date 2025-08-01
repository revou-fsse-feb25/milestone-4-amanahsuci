export class UserResponseDto {
    id: number;
    name?: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }
}