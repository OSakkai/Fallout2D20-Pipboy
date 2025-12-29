import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket, payload: any) {
    return { event: 'pong', data: 'Connection successful' };
  }

  // Future combat events will be added here
  @SubscribeMessage('combat:damage')
  handleCombatDamage(client: Socket, payload: any) {
    // To be implemented later
    console.log('Combat damage event received:', payload);
    this.server.emit('combat:update', payload);
  }

  @SubscribeMessage('combat:healing')
  handleCombatHealing(client: Socket, payload: any) {
    // To be implemented later
    console.log('Combat healing event received:', payload);
    this.server.emit('combat:update', payload);
  }

  @SubscribeMessage('combat:movement')
  handleCombatMovement(client: Socket, payload: any) {
    // To be implemented later
    console.log('Combat movement event received:', payload);
    this.server.emit('combat:update', payload);
  }
}
