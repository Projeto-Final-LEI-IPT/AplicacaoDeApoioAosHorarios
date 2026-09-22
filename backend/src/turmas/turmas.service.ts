import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateTurmaDto } from './dto/create-turma.dto'
import { UpdateTurmaDto } from './dto/update-turma.dto'

@Injectable()
export class TurmasService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.turma.findMany({
      include: { curso: true },
    })
  }

  findOne(id: number) {
    return this.prisma.turma.findUnique({
      where: { id },
      include: { curso: true },
    })
  }

  async create(dto: CreateTurmaDto) {
    const turmaExistente = await this.prisma.turma.findFirst({
      where: { nome: dto.nome, cursoId: dto.cursoId },
    })

    if (turmaExistente) {
      throw new ConflictException(`Já existe uma turma com o nome "${dto.nome}" neste curso`)
    }

    return this.prisma.turma.create({
      data: {
        nome: dto.nome,
        ano: dto.ano,
        semestre: dto.semestre,
        curso: { connect: { id: dto.cursoId } },
      },
    })
  }

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

  remove(id: number) {
    return this.prisma.turma.delete({
      where: { id },
    })
  }
}