import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Post } from '../post/entities/post.entity';

// socket
@WebSocketGateway()
export class SocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private count = 1;

  // on connection with socket
  handleConnection() {
    console.log(`Client # ${this.count} connected`);
    this.count += 1;
  }

  // on disconnect from socket
  handleDisconnect() {
    this.count -= 1;
    console.log(`Client # ${this.count} disconnected`);
  }

  // when new post uploaded
  handleNewPost(post: Post) {
    this.server.emit('newPost', post);
  }
}
