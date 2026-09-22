import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { DocentesService } from './docentes.service'
import { CreateDocenteDto } from './dto/create-docente.dto'
import { UpdateDocenteDto } from './dto/update-docente.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('docentes')
export class DocentesController {
  constructor(private docentesService: DocentesService) {}

  @Get()
  findAll() {
    return this.docentesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.docentesService.findOne(Number(id))
  }

  @Roles('ADMIN', 'COMISSAO_ESCOLA', 'COMISSAO_CURSO')
  @Post()
  create(@Body() dto: CreateDocenteDto) {
    return this.docentesService.create(dto)
  }

  @Roles('ADMIN', 'COMISSAO_ESCOLA', 'COMISSAO_CURSO')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDocenteDto) {
    return this.docentesService.update(Number(id), dto)
  }

  @Roles('ADMIN', 'COMISSAO_ESCOLA', 'COMISSAO_CURSO')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.docentesService.remove(Number(id))
  }
}