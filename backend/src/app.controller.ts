import { Controller, Get, UseGuards, Request } from '@nestjs/common'
import { AppService } from './app.service'
import { JwtAuthGuard } from './auth/jwt-auth.guard'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  // Rota protegida — só acessível com token JWT válido
  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  getPerfil(@Request() req: any) {
    return req.user
  }
}