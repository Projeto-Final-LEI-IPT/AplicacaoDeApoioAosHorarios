import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

// Guard que protege os endpoints — verifica se o token JWT é válido
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}