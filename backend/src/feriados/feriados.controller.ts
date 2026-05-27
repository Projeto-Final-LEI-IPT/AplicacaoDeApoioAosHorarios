import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards, ParseIntPipe } from '@nestjs/common'
import { FeriadosService } from './feriados.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('feriados')
export class FeriadosController {
  constructor(private readonly feriadosService: FeriadosService) {}

  @Get()
  getFeriados(@Query('ano') ano: string) {
    const anoNum = ano ? parseInt(ano) : new Date().getFullYear()
    return this.feriadosService.getFeriados(anoNum)
  }

  @Post('locais')
  criarFeriadoLocal(@Body() body: { nome: string; data: string }) {
    return this.feriadosService.criarFeriadoLocal(body.nome, body.data)
  }

  @Delete('locais/:id')
  eliminarFeriadoLocal(@Param('id', ParseIntPipe) id: number) {
    return this.feriadosService.eliminarFeriadoLocal(id)
  }
}
