import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from '../prisma/prisma.module'
import { SalasModule } from './salas/salas.module'
import { DocentesModule } from './docentes/docentes.module'
import { CursosModule } from './cursos/cursos.module'
import { UcsModule } from './ucs/ucs.module'
import { TurmasModule } from './turmas/turmas.module'

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    SalasModule,
    DocentesModule,
    CursosModule,
    UcsModule,
    TurmasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}