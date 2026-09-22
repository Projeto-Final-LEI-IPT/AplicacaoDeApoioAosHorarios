import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { UcsService } from './ucs.service'
import { CreateUcDto } from './dto/create-uc.dto'
import { UpdateUcDto } from './dto/update-uc.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ucs')
export class UcsController {
  constructor(private ucsService: UcsService) {}

  @Get()
  findAll() {
    return this.ucsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ucsService.findOne(Number(id))
  }

  @Roles('ADMIN', 'COMISSAO_ESCOLA', 'COMISSAO_CURSO')
  @Post()
  create(@Body() dto: CreateUcDto) {
    return this.ucsService.create(dto)
  }

  @Roles('ADMIN', 'COMISSAO_ESCOLA', 'COMISSAO_CURSO')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUcDto) {
    return this.ucsService.update(Number(id), dto)
  }

  @Roles('ADMIN', 'COMISSAO_ESCOLA', 'COMISSAO_CURSO')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ucsService.remove(Number(id))
  }
}