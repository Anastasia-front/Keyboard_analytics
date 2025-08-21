/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { IsString } from 'class-validator';

import { Server } from 'socket.io';

import { CounterService } from './counter.service';

export class KeyPressDto {
  @IsString()
  key: string;
}

@WebSocketGateway({ cors: { origin: '*' } })
export class CounterGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private counterService: CounterService) {}

  @SubscribeMessage('keyPress')
  async handleKeyPress(@MessageBody() data: KeyPressDto): Promise<void> {
    const stats = await this.counterService.increment(data.key);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.server.emit('stats', stats);
  }
}
