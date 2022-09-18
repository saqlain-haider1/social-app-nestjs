import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { SocketService } from './socket/socket.service';
import { SocketModule } from './socket/socket.module';
import { ModeratorModule } from './moderator/moderator.module';
import { tokenVerification } from './middleware/jwtVerification.middleware';
import { PostController } from './post/post.controller';
import { UserController } from './user/user.controller';
import { ModeratorController } from './moderator/moderator.controller';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PostModule,
    SocketModule,
    ModeratorModule,
    MongooseModule.forRoot(process.env.DBURI),
  ],
  controllers: [AppController],
  providers: [AppService, SocketService],
})
export class AppModule {
  // token verification middleware
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(tokenVerification)
      .exclude(
        { path: 'user', method: RequestMethod.POST },
        { path: 'user/login', method: RequestMethod.POST },
        { path: 'moderator', method: RequestMethod.POST },
        { path: 'moderator/login', method: RequestMethod.POST },
      )
      .forRoutes(PostController, UserController, ModeratorController);
  }
}
