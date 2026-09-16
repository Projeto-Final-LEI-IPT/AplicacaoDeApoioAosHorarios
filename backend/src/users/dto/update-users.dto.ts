import { Role } from "@prisma/client";

export class UpdateUsersDto {
    nome?: string;
    email?: string;
    password?: string;
    role?: Role;
}