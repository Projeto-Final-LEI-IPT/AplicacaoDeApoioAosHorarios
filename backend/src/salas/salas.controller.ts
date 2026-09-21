import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { SalasService } from './salas.service'
import { CreateSalaDto } from './dto/create-sala.dto'
import { UpdateSalaDto } from './dto/update-sala.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'

// Todos os endpoints deste controller estão protegidos com JWT
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('salas')
export class SalasController {
  constructor(private salasService: SalasService) {}

  // GET /salas — lista todas as salas
  @Get()
  findAll() {
    return this.salasService.findAll()
  }

  // GET /salas/:id — retorna uma sala pelo id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salasService.findOne(Number(id))
  }

  // POST /salas — cria uma nova sala
  @Roles('ADMIN', 'COMISSAO_ESCOLA', 'COMISSAO_CURSO')
  @Post()
  create(@Body() dto: CreateSalaDto) {
    return this.salasService.create(dto)
  }

  // PUT /salas/:id — atualiza uma sala pelo id
  @Roles('ADMIN', 'COMISSAO_ESCOLA', 'COMISSAO_CURSO')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSalaDto) {
    return this.salasService.update(Number(id), dto)
  }

  // DELETE /salas/:id — apaga uma sala pelo id
  @Roles('ADMIN', 'COMISSAO_ESCOLA', 'COMISSAO_CURSO')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salasService.remove(Number(id))
  }
}