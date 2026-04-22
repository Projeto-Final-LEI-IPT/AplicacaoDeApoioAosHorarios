import { Controller, Post, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ImportacaoService } from './importacao.service'

@UseGuards(JwtAuthGuard)
@Controller('importacao')
export class ImportacaoController {
  constructor(private importacaoService: ImportacaoService) {}

  // POST /importacao — recebe o ficheiro Excel e importa os dados
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async importar(@UploadedFile() file: Express.Multer.File) {
    return this.importacaoService.importarExcel(file.buffer)
  }
}