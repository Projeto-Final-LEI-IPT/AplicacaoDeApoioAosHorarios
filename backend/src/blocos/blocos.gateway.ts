import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

@WebSocketGateway({ cors: { origin: 'http://localhost:5173' } })
export class BlocosGateway {
  @WebSocketServer()
  server!: Server

  emitirBlocoCriado(bloco: any) {
    this.server.emit('bloco:criado', bloco)
  }

  emitirBlocoAtualizado(bloco: any) {
    this.server.emit('bloco:atualizado', bloco)
  }

  emitirBlocoApagado(id: number) {
    this.server.emit('bloco:apagado', id)
  }
}
