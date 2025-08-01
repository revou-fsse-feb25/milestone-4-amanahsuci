import { UserRole } from '@prisma/client';

export class User {
    id: number;  
    name?: string;
    email: string; 
    role: UserRole;  
    createdAt: Date;    
    updatedAt: Date;
}