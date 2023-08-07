import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';

export class CustomIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): Server {
    const server = super.createIOServer(port, options);
    return server;
  }

  bindClientConnect(server: Server, callback: (...args: any[]) => void) {
    server.on('connection', callback);
  }

  bindClientDisconnect(client: Server, callback: (...args: any[]) => void) {
    client.on('disconnect', callback);
  }
}
