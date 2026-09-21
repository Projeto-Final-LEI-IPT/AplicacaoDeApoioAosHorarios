import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { TurmasService } from './turmas.service'
import { CreateTurmaDto } from './dto/create-turma.dto'
import { UpdateTurmaDto } from './dto/update-turma.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('turmas')
export class TurmasController {
  constructor(private turmasService: TurmasService) {}

  // GET /turmas — lista todas as turmas
  @Get()
  findAll() {
    return this.turmasService.findAll()
  }

  // GET /turmas/:id — retorna uma turma pelo id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turmasService.findOne(Number(id))
  }

  // POST /turmas — cria uma nova turma
  @Roles('ADMIN', 'COMISSAO_ESCOLA', 'COMISSAO_CURSO')
  @Post()
  create(@Body() dto: CreateTurmaDto) {
    return this.turmasService.create(dto)
  }

  // PUT /turmas/:id — atualiza uma turma pelo id
  @Roles('ADMIN', 'COMISSAO_ESCOLA', 'COMISSAO_CURSO')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTurmaDto) {
    return this.turmasService.update(Number(id), dto)
  }

  // DELETE /turmas/:id — apaga uma turma pelo id
  @Roles('ADMIN', 'COMISSAO_ESCOLA', 'COMISSAO_CURSO')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.turmasService.remove(Number(id))
  }
}