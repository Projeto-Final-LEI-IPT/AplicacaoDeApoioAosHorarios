import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { CursosService } from './cursos.service'
import { CreateCursoDto } from './dto/create-curso.dto'
import { UpdateCursoDto } from './dto/update-curso.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('cursos')
export class CursosController {
  constructor(private cursosService: CursosService) {}

  // GET /cursos — lista todos os cursos
  @Get()
  findAll() {
    return this.cursosService.findAll()
  }

  // GET /cursos/:id — retorna um curso pelo id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cursosService.findOne(Number(id))
  }

  // POST /cursos — cria um novo curso
  @Post()
  create(@Body() dto: CreateCursoDto) {
    return this.cursosService.create(dto)
  }

  // PUT /cursos/:id — atualiza um curso pelo id
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCursoDto) {
    return this.cursosService.update(Number(id), dto)
  }

  // DELETE /cursos/:id — apaga um curso pelo id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cursosService.remove(Number(id))
  }
}