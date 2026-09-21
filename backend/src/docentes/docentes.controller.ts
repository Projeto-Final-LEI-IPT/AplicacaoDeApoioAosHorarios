import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { DocentesService } from './docentes.service'
import { CreateDocenteDto } from './dto/create-docente.dto'
import { UpdateDocenteDto } from './dto/update-docente.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'

// Todos os endpoints deste controller estão protegidos com JWT
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('docentes')
export class DocentesController {
  constructor(private docentesService: DocentesService) {}

  // GET /docentes — lista todos os docentes
  @Get()
  findAll() {
    return this.docentesService.findAll()
  }

  // GET /docentes/:id — retorna um docente pelo id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.docentesService.findOne(Number(id))
  }

  // POST /docentes — cria um novo docente
  @Roles('ADMIN', 'COMISSAO_ESCOLA', 'COMISSAO_CURSO')
  @Post()
  create(@Body() dto: CreateDocenteDto) {
    return this.docentesService.create(dto)
  }

  // PUT /docentes/:id — atualiza um docente pelo id
  @Roles('ADMIN', 'COMISSAO_ESCOLA', 'COMISSAO_CURSO')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDocenteDto) {
    return this.docentesService.update(Number(id), dto)
  }

  // DELETE /docentes/:id — apaga um docente pelo id
  @Roles('ADMIN', 'COMISSAO_ESCOLA', 'COMISSAO_CURSO')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.docentesService.remove(Number(id))
  }
}