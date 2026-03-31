import { Module } from '@nestjs/common'
import { UcsService } from './ucs.service'
import { UcsController } from './ucs.controller'
import { PrismaModule } from '../../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [UcsController],
  providers: [UcsService],
})
export class UcsModule {}