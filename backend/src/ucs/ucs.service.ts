import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateUcDto } from './dto/create-uc.dto'
import { UpdateUcDto } from './dto/update-uc.dto'

@Injectable()
export class UcsService {
  constructor(private prisma: PrismaService) {}

  // Retorna todas as UCs com o curso associado
  findAll() {
    return this.prisma.unidadeCurricular.findMany({
      include: { curso: true },
    })
  }

  // Retorna uma UC pelo id
  findOne(id: number) {
    return this.prisma.unidadeCurricular.findUnique({
      where: { id },
      include: { curso: true },
    })
  }

  // Cria uma nova UC
  async create(dto: CreateUcDto) {
    const ucPorCodigo = await this.prisma.unidadeCurricular.findFirst({
      where: { codigo: dto.codigo },
    })

    if (ucPorCodigo) {
      throw new ConflictException(`Já existe uma UC com o código "${dto.codigo}"`)
    }

    const ucPorNome = await this.prisma.unidadeCurricular.findFirst({
      where: { nome: dto.nome, cursoId: dto.cursoId },
    })

    if (ucPorNome) {
      throw new ConflictException(`Já existe uma UC com o nome "${dto.nome}" neste curso`)
    }

    return this.prisma.unidadeCurricular.create({
      data: {
        nome: dto.nome,
        codigo: dto.codigo,
        semestre: dto.semestre,
        horasContacto: dto.horasContacto,
        curso: { connect: { id: dto.cursoId } },
      },
    })
  }

  // Atualiza uma UC pelo id
  update(id: number, dto: UpdateUcDto) {
    return this.prisma.unidadeCurricular.update({
      where: { id },
      data: {
        nome: dto.nome,
        codigo: dto.codigo,
        semestre: dto.semestre,
        horasContacto: dto.horasContacto,
        ...(dto.cursoId && { curso: { connect: { id: dto.cursoId } } }),
      },
    })
  }

  // Apaga uma UC pelo id
  remove(id: number) {
    return this.prisma.unidadeCurricular.delete({
      where: { id },
    })
  }
}