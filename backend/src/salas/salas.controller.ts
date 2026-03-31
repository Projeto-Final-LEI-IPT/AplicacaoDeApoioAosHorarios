import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { SalasService } from './salas.service'
import { CreateSalaDto } from './dto/create-sala.dto'
import { UpdateSalaDto } from './dto/update-sala.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

// Todos os endpoints deste controller estão protegidos com JWT
@UseGuards(JwtAuthGuard)
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
  @Post()
  create(@Body() dto: CreateSalaDto) {
    return this.salasService.create(dto)
  }

  // PUT /salas/:id — atualiza uma sala pelo id
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSalaDto) {
    return this.salasService.update(Number(id), dto)
  }

  // DELETE /salas/:id — apaga uma sala pelo id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salasService.remove(Number(id))
  }
}