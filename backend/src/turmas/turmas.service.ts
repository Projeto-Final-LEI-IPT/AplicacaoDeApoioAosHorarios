import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateTurmaDto } from './dto/create-turma.dto'
import { UpdateTurmaDto } from './dto/update-turma.dto'

@Injectable()
export class TurmasService {
  constructor(private prisma: PrismaService) {}

  // Retorna todas as turmas com o curso associado
  findAll() {
    return this.prisma.turma.findMany({
      include: { curso: true },
    })
  }

  // Retorna uma turma pelo id
  findOne(id: number) {
    return this.prisma.turma.findUnique({
      where: { id },
      include: { curso: true },
    })
  }

  // Cria uma nova turma
  create(dto: CreateTurmaDto) {
    return this.prisma.turma.create({
      data: {
        nome: dto.nome,
        ano: dto.ano,
        semestre: dto.semestre,
        curso: { connect: { id: dto.cursoId } },
      },
    })
  }

  // Atualiza uma turma pelo id
  update(id: number, dto: UpdateTurmaDto) {
    return this.prisma.turma.update({
      where: { id },
      data: {
        nome: dto.nome,
        ano: dto.ano,
        semestre: dto.semestre,
        ...(dto.cursoId && { curso: { connect: { id: dto.cursoId } } }),
      },
    })
  }

  // Apaga uma turma pelo id
  remove(id: number) {
    return this.prisma.turma.delete({
      where: { id },
    })
  }
}