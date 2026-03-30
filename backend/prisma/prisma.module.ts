import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exporta para ser usado noutros módulos
})
export class PrismaModule {}