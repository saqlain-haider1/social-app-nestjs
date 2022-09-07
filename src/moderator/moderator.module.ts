import { Module } from '@nestjs/common';
import { ModeratorService } from './moderator.service';
import { ModeratorController } from './moderator.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { postSchema } from '../post/entities/post.entity';
import { userSchema } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';
import { moderatorSchema } from './entities/moderator.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Post', schema: postSchema },
      { name: 'User', schema: userSchema },
      { name: 'Moderator', schema: moderatorSchema },
    ]),
    UserModule,
    PostModule,
  ],
  controllers: [ModeratorController],
  providers: [ModeratorService],
})
export class ModeratorModule {}
