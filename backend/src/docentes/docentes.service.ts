import { Injectable,ConflictException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateDocenteDto } from './dto/create-docente.dto'
import { UpdateDocenteDto } from './dto/update-docente.dto'


@Injectable()
export class DocentesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.docente.findMany({
      include: { user: true }, 
    })
  }

  findOne(id: number) {
    return this.prisma.docente.findUnique({
      where: { id },
      include: { user: true },
    })
  }

async create(dto: CreateDocenteDto) {
  const docenteExistente = await this.prisma.docente.findFirst({
    where: { email: dto.email },
  })

  if (docenteExistente) {
    throw new ConflictException(`Já existe um docente com o email "${dto.email}"`)
  }

  if (dto.userId) {
    return this.prisma.docente.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        maxHorasDia: dto.maxHorasDia ?? 8,
        user: { connect: { id: dto.userId } },
      },
    })
  }

  return this.prisma.docente.create({
    data: {
      nome: dto.nome,
      email: dto.email,
      maxHorasDia: dto.maxHorasDia ?? 8,
    },
  })
}

  update(id: number, dto: UpdateDocenteDto) {
    return this.prisma.docente.update({
      where: { id },
      data: dto,
    })
  }

  remove(id: number) {
    return this.prisma.docente.delete({
      where: { id },
    })
  }
}