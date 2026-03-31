export class CreateCursoDto {
  nome: string
  tipo: 'SEMESTRAL' | 'MODULAR'
  anoLetivo: string
}