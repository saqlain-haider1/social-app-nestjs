import { forwardRef, Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { postSchema } from './entities/post.entity';
import { userSchema } from '../user/entities/user.entity';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Post', schema: postSchema },
      { name: 'User', schema: userSchema },
    ]),
    forwardRef(() => SocketModule),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
