import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateDocenteDto } from './dto/create-docente.dto'
import { UpdateDocenteDto } from './dto/update-docente.dto'

@Injectable()
export class DocentesService {
  constructor(private prisma: PrismaService) {}

  // Retorna todos os docentes
  findAll() {
    return this.prisma.docente.findMany({
      include: { user: true }, // Inclui os dados do utilizador associado
    })
  }

  // Retorna um docente pelo id
  findOne(id: number) {
    return this.prisma.docente.findUnique({
      where: { id },
      include: { user: true },
    })
  }

create(dto: CreateDocenteDto) {
  return this.prisma.docente.create({
    data: {
      nome: dto.nome,
      email: dto.email,
      maxHorasDia: dto.maxHorasDia ?? 8,
      user: { connect: { id: dto.userId } },
    },
  })
}

  // Atualiza um docente pelo id
  update(id: number, dto: UpdateDocenteDto) {
    return this.prisma.docente.update({
      where: { id },
      data: dto,
    })
  }

  // Apaga um docente pelo id
  remove(id: number) {
    return this.prisma.docente.delete({
      where: { id },
    })
  }
}