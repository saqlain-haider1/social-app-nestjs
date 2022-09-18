import { Module } from '@nestjs/common';
import { SocketsGateway } from './socket.gateway';

@Module({
  imports: [],
  providers: [SocketsGateway],
  exports: [SocketsGateway],
})
export class SocketModule {}
