import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateCursoDto } from './dto/create-curso.dto'
import { UpdateCursoDto } from './dto/update-curso.dto'

@Injectable()
export class CursosService {
  constructor(private prisma: PrismaService) {}

  // Retorna todos os cursos com as turmas e UCs associadas
  findAll() {
    return this.prisma.curso.findMany({
      include: {
        turmas: true,
        ucs: true,
      },
    })
  }

  // Retorna um curso pelo id
  findOne(id: number) {
    return this.prisma.curso.findUnique({
      where: { id },
      include: {
        turmas: true,
        ucs: true,
      },
    })
  }

  // Cria um novo curso
  create(dto: CreateCursoDto) {
    return this.prisma.curso.create({
      data: dto,
    })
  }

  // Atualiza um curso pelo id
  update(id: number, dto: UpdateCursoDto) {
    return this.prisma.curso.update({
      where: { id },
      data: dto,
    })
  }

  // Apaga um curso pelo id
  remove(id: number) {
    return this.prisma.curso.delete({
      where: { id },
    })
  }
}