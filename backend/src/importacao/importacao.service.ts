import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import * as XLSX from 'xlsx'

@Injectable()
export class ImportacaoService {
  constructor(private prisma: PrismaService) {}

  async importarExcel(buffer: Buffer) {
    // Lê o ficheiro Excel a partir do buffer
    const workbook = XLSX.read(buffer, { type: 'buffer' })

    const resultados = {
      cursos: 0,
      ucs: 0,
      docentes: 0,
      turmas: 0,
      erros: [] as string[],
    }

    // Lê a folha de Cursos se existir
    if (workbook.SheetNames.includes('Cursos')) {
      const sheet = workbook.Sheets['Cursos']
      const rows = XLSX.utils.sheet_to_json<any>(sheet)

      for (const row of rows) {
        try {
          await this.prisma.curso.create({
            data: {
              nome: row['Nome'],
              tipo: row['Tipo'] === 'MODULAR' ? 'MODULAR' : 'SEMESTRAL',
              anoLetivo: row['Ano Letivo'],
            },
          })
          resultados.cursos++
        } catch {
          resultados.erros.push(`Erro ao importar curso: ${row['Nome']}`)
        }
      }
    }

    // Lê a folha de Docentes se existir
    if (workbook.SheetNames.includes('Docentes')) {
      const sheet = workbook.Sheets['Docentes']
      const rows = XLSX.utils.sheet_to_json<any>(sheet)

      for (const row of rows) {
        try {
          await this.prisma.docente.create({
            data: {
              nome: row['Nome'],
              email: row['Email'],
              maxHorasDia: row['Max Horas Dia'] ?? 8,
            },
          })
          resultados.docentes++
        } catch {
          resultados.erros.push(`Erro ao importar docente: ${row['Nome']}`)
        }
      }
    }

    // Lê a folha de Turmas se existir
    if (workbook.SheetNames.includes('Turmas')) {
      const sheet = workbook.Sheets['Turmas']
      const rows = XLSX.utils.sheet_to_json<any>(sheet)

      for (const row of rows) {
        try {
          const curso = await this.prisma.curso.findFirst({
            where: { nome: row['Curso'] },
          })

          if (!curso) {
            resultados.erros.push(`Curso não encontrado para turma: ${row['Nome']}`)
            continue
          }

          await this.prisma.turma.create({
            data: {
              nome: row['Nome'],
              ano: row['Ano'],
              semestre: row['Semestre'],
              curso: { connect: { id: curso.id } },
            },
          })
          resultados.turmas++
        } catch {
          resultados.erros.push(`Erro ao importar turma: ${row['Nome']}`)
        }
      }
    }

    // Lê a folha de UCs se existir
    if (workbook.SheetNames.includes('UCs')) {
      const sheet = workbook.Sheets['UCs']
      const rows = XLSX.utils.sheet_to_json<any>(sheet)

      for (const row of rows) {
        try {
          const curso = await this.prisma.curso.findFirst({
            where: { nome: row['Curso'] },
          })

          if (!curso) {
            resultados.erros.push(`Curso não encontrado para UC: ${row['Nome']}`)
            continue
          }

          await this.prisma.unidadeCurricular.create({
            data: {
              nome: row['Nome'],
              codigo: row['Código'],
              semestre: row['Semestre'],
              horasContacto: row['Horas Contacto'],
              curso: { connect: { id: curso.id } },
            },
          })
          resultados.ucs++
        } catch {
          resultados.erros.push(`Erro ao importar UC: ${row['Nome']}`)
        }
      }
    }

    return resultados
  }
}