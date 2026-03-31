import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { UcsService } from './ucs.service'
import { CreateUcDto } from './dto/create-uc.dto'
import { UpdateUcDto } from './dto/update-uc.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('ucs')
export class UcsController {
  constructor(private ucsService: UcsService) {}

  // GET /ucs — lista todas as UCs
  @Get()
  findAll() {
    return this.ucsService.findAll()
  }

  // GET /ucs/:id — retorna uma UC pelo id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ucsService.findOne(Number(id))
  }

  // POST /ucs — cria uma nova UC
  @Post()
  create(@Body() dto: CreateUcDto) {
    return this.ucsService.create(dto)
  }

  // PUT /ucs/:id — atualiza uma UC pelo id
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUcDto) {
    return this.ucsService.update(Number(id), dto)
  }

  // DELETE /ucs/:id — apaga uma UC pelo id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ucsService.remove(Number(id))
  }
}