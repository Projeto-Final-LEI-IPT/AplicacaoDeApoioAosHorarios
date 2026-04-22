import { Module } from '@nestjs/common'
import { ImportacaoService } from './importacao.service'
import { ImportacaoController } from './importacao.controller'
import { PrismaModule } from '../../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [ImportacaoController],
  providers: [ImportacaoService],
})
export class ImportacaoModule {}