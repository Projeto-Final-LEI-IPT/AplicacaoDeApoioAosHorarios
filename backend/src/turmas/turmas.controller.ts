import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { TurmasService } from './turmas.service'
import { CreateTurmaDto } from './dto/create-turma.dto'
import { UpdateTurmaDto } from './dto/update-turma.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
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
  @Post()
  create(@Body() dto: CreateTurmaDto) {
    return this.turmasService.create(dto)
  }

  // PUT /turmas/:id — atualiza uma turma pelo id
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTurmaDto) {
    return this.turmasService.update(Number(id), dto)
  }

  // DELETE /turmas/:id — apaga uma turma pelo id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.turmasService.remove(Number(id))
  }
}