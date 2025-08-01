import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty({ example: 1, description: 'Unique ID of the user' })
    id: number;

    @ApiPropertyOptional({ example: 'John Doe', description: 'Full name of the user' })
    name?: string;

    @ApiProperty({ example: 'johndoe@example.com', description: 'Email address of the user' })
    email: string;

    @ApiProperty({ example: 'customer', description: 'Role of the user (admin or customer)' })
    role: string;

    @ApiProperty({ example: '2025-08-01T10:15:30.000Z', description: 'User creation timestamp' })
    createdAt: Date;

    @ApiProperty({ example: '2025-08-01T11:00:00.000Z', description: 'User last update timestamp' })
    updatedAt: Date;

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }
}