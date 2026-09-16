import { Role } from "@prisma/client";

export class CreateUsersDto {
    nome!: string;
    email!: string;
    password!: string;
    role!: Role;
}