import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

export interface FeriadoDto {
  id?: number
  nome: string
  data: string // YYYY-MM-DD
  tipo: 'nacional' | 'local'
}

@Injectable()
export class FeriadosService {
  constructor(private prisma: PrismaService) {}

  private calcularPascoa(ano: number): Date {
    const a = ano % 19
    const b = Math.floor(ano / 100)
    const c = ano % 100
    const d = Math.floor(b / 4)
    const e = b % 4
    const f = Math.floor((b + 8) / 25)
    const g = Math.floor((b - f + 1) / 3)
    const h = (19 * a + b - d - g + 15) % 30
    const i = Math.floor(c / 4)
    const k = c % 4
    const l = (32 + 2 * e + 2 * i - h - k) % 7
    const m = Math.floor((a + 11 * h + 22 * l) / 451)
    const mes = Math.floor((h + l - 7 * m + 114) / 31)
    const dia = ((h + l - 7 * m + 114) % 31) + 1
    return new Date(ano, mes - 1, dia)
  }

  private addDias(data: Date, dias: number): Date {
    const d = new Date(data)
    d.setDate(d.getDate() + dias)
    return d
  }

  private toISO(data: Date): string {
    return data.toISOString().slice(0, 10)
  }

  private feriadosNacionais(ano: number): FeriadoDto[] {
    const pascoa = this.calcularPascoa(ano)

    const fixos: FeriadoDto[] = [
      { nome: 'Ano Novo', data: `${ano}-01-01`, tipo: 'nacional' },
      { nome: 'Dia da Liberdade', data: `${ano}-04-25`, tipo: 'nacional' },
      { nome: 'Dia do Trabalhador', data: `${ano}-05-01`, tipo: 'nacional' },
      { nome: 'Dia de Portugal', data: `${ano}-06-10`, tipo: 'nacional' },
      { nome: 'Assunção de Nossa Senhora', data: `${ano}-08-15`, tipo: 'nacional' },
      { nome: 'Implantação da República', data: `${ano}-10-05`, tipo: 'nacional' },
      { nome: 'Dia de Todos os Santos', data: `${ano}-11-01`, tipo: 'nacional' },
      { nome: 'Restauração da Independência', data: `${ano}-12-01`, tipo: 'nacional' },
      { nome: 'Imaculada Conceição', data: `${ano}-12-08`, tipo: 'nacional' },
      { nome: 'Natal', data: `${ano}-12-25`, tipo: 'nacional' },
    ]

    const moveis: FeriadoDto[] = [
      { nome: 'Carnaval', data: this.toISO(this.addDias(pascoa, -47)), tipo: 'nacional' },
      { nome: 'Sexta-feira Santa', data: this.toISO(this.addDias(pascoa, -2)), tipo: 'nacional' },
      { nome: 'Páscoa', data: this.toISO(pascoa), tipo: 'nacional' },
      { nome: 'Corpo de Deus', data: this.toISO(this.addDias(pascoa, 60)), tipo: 'nacional' },
    ]

    return [...fixos, ...moveis].sort((a, b) => a.data.localeCompare(b.data))
  }

  async getFeriados(ano: number): Promise<FeriadoDto[]> {
    const nacionais = this.feriadosNacionais(ano)

    const inicioAno = new Date(ano, 0, 1)
    const fimAno = new Date(ano, 11, 31)

    const locais = await this.prisma.feriadoLocal.findMany({
      where: { data: { gte: inicioAno, lte: fimAno } },
      orderBy: { data: 'asc' },
    })

    const locaisDto: FeriadoDto[] = locais.map((f) => ({
      id: f.id,
      nome: f.nome,
      data: this.toISO(f.data),
      tipo: 'local',
    }))

    return [...nacionais, ...locaisDto].sort((a, b) => a.data.localeCompare(b.data))
  }

  async criarFeriadoLocal(nome: string, data: string) {
    return this.prisma.feriadoLocal.create({
      data: { nome, data: new Date(data) },
    })
  }

  async eliminarFeriadoLocal(id: number) {
    const existe = await this.prisma.feriadoLocal.findUnique({ where: { id } })
    if (!existe) throw new NotFoundException('Feriado não encontrado')
    return this.prisma.feriadoLocal.delete({ where: { id } })
  }
}
