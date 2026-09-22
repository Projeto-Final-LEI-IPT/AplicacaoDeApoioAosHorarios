import { Injectable, ConflictException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service.js'
import { CreateSalaDto } from './dto/create-sala.dto'
import { UpdateSalaDto } from './dto/update-sala.dto'

@Injectable()
export class SalasService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.sala.findMany()
  }

  findOne(id: number) {
    return this.prisma.sala.findUnique({
      where: { id },
    })
  }

async create(dto: CreateSalaDto) {
  const salaExistente = await this.prisma.sala.findFirst({
    where: { nome: dto.nome },
  })

  if (salaExistente) {
    throw new ConflictException(`Já existe uma sala com o nome "${dto.nome}"`)
  }

  return this.prisma.sala.create({
    data: dto,
  })
}

  update(id: number, dto: UpdateSalaDto) {
    return this.prisma.sala.update({
      where: { id },
      data: dto,
    })
  }

  remove(id: number) {
    return this.prisma.sala.delete({
      where: { id },
    })
  }
}