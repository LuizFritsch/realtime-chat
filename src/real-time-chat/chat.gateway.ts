// src/websocket/game.gateway.ts
/**
 * diferenca entre o emit e o send
 * usar adaptadores socketio ou ws do js
 */
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@UsePipes(new ValidationPipe())
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  credentials: true,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private players: Set<Socket> = new Set();
  private chat: Set<{ sender: string; message: string }> = new Set();
  private connectionLogger = new Logger('connectionLogger');
  private eventLogger = new Logger('eventLogger');

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): void {
    this.eventLogger.log(`Client ${client.id} sent: ${payload}`);
    const { sender, message, timeSent } = JSON.parse(payload).data;
    this.chat.add(JSON.parse(payload).data);
    this.players.forEach(async (client) => {
      await client.emit('message', { sender, message, timeSent });
    });
  }

  handleConnection(client: Socket): void {
    this.players.add(client);
    this.connectionLogger.log(`client ${client.id} joined`);
    this.chat.forEach((conversa) => {
      client.send(conversa);
    });
  }

  handleDisconnect(client: Socket): void {
    this.players.delete(client);
    this.connectionLogger.log(`client ${client.id} left`);
  }
}
