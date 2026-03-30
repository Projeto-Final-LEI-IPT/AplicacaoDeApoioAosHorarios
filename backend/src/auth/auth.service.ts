import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../../prisma/prisma.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    // Procura o utilizador pelo email
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    // Se o utilizador não existir lança erro de autenticação
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas')
    }

    // Compara a password fornecida com a password encriptada na base de dados
    const passwordValida = await bcrypt.compare(password, user.password)

    if (!passwordValida) {
      throw new UnauthorizedException('Credenciais inválidas')
    }

    // Gera e devolve o token JWT com o id, email e role do utilizador
    const payload = { sub: user.id, email: user.email, role: user.role }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}