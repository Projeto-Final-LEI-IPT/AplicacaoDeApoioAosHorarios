import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateCursoDto } from './dto/create-curso.dto'
import { UpdateCursoDto } from './dto/update-curso.dto'

@Injectable()
export class CursosService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.curso.findMany({
      include: {
        turmas: true,
        ucs: true,
      },
    })
  }

  findOne(id: number) {
    return this.prisma.curso.findUnique({
      where: { id },
      include: {
        turmas: true,
        ucs: true,
      },
    })
  }

  create(dto: CreateCursoDto) {
    return this.prisma.curso.create({
      data: dto,
    })
  }

  update(id: number, dto: UpdateCursoDto) {
    return this.prisma.curso.update({
      where: { id },
      data: dto,
    })
  }

  remove(id: number) {
    return this.prisma.curso.delete({
      where: { id },
    })
  }
}