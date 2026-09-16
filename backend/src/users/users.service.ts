import { Injectable, BadRequestException  } from "@nestjs/common";
import {PrismaService} from '../../prisma/prisma.service';
import {CreateUsersDto} from './dto/create-users.dto';
import {UpdateUsersDto} from './dto/update-users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}
    // Implement user-related logic here

    findAll() {
        return this.prisma.user.findMany({
            select: { id : true, nome: true, email: true, role: true } // Exclui a password da resposta
        });
    }

    findOne(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
            select: { id: true, nome: true, email: true, role: true } // Exclui a password da resposta
        })
    }

    async create(dto: CreateUsersDto) {
        if (!dto.email.endsWith('@ipt.pt')) {
            throw new BadRequestException('O email tem de terminar em @ipt.pt')
        }   
        const passwordEncriptada = await bcrypt.hash(dto.password, 10);
        return this.prisma.user.create({
            data: {
                nome: dto.nome,
                email: dto.email,
                password: passwordEncriptada,
                role: dto.role,
            },
            select: { id: true, nome: true, email: true, role: true } // Exclui a password da resposta
            })
    }

    update(id: number, dto: UpdateUsersDto) {
        return this.prisma.user.update({
            where: { id },
            data: dto,
            select: { id: true, nome: true, email: true, role: true } // Exclui a password da resposta
        })
    }

    remove(id: number) {
        return this.prisma.user.delete({
            where: { id },
        });
    }
}