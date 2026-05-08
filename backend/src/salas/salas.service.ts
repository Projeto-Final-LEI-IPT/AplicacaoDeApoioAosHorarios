import { Injectable, ConflictException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service.js'
import { CreateSalaDto } from './dto/create-sala.dto'
import { UpdateSalaDto } from './dto/update-sala.dto'

@Injectable()
export class SalasService {
  constructor(private prisma: PrismaService) {}

  // Retorna todas as salas
  findAll() {
    return this.prisma.sala.findMany()
  }

  // Retorna uma sala pelo id
  findOne(id: number) {
    return this.prisma.sala.findUnique({
      where: { id },
    })
  }

  // Cria uma nova sala
async create(dto: CreateSalaDto) {
  // Verifica se já existe uma sala com o mesmo nome
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

  // Atualiza uma sala pelo id
  update(id: number, dto: UpdateSalaDto) {
    return this.prisma.sala.update({
      where: { id },
      data: dto,
    })
  }

  // Apaga uma sala pelo id
  remove(id: number) {
    return this.prisma.sala.delete({
      where: { id },
    })
  }
}