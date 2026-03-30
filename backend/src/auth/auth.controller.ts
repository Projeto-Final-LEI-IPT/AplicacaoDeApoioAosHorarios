import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'

// DTO com os campos necessários para o login
class LoginDto {
  email: string
  password: string
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Endpoint POST /auth/login — recebe email e password e devolve o token JWT
  @Post('login')
  async login(@Body() body: LoginDto) {
    if (!body.email || !body.password) {
      throw new UnauthorizedException('Preenche todos os campos')
    }
    return this.authService.login(body.email, body.password)
  }
}