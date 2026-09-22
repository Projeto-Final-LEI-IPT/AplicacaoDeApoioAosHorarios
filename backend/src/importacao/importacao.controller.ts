import { Controller, Post, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { ImportacaoService } from './importacao.service'
import { Multer } from 'multer'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'COMISSAO_ESCOLA', 'COMISSAO_CURSO')
@Controller('importacao')
export class ImportacaoController {
  constructor(private importacaoService: ImportacaoService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async importar(@UploadedFile() file: Express.Multer.File) {
    return this.importacaoService.importarExcel(file.buffer)
  }

  @Delete()
  async limpar() {
    return this.importacaoService.limparDados()
  }
}