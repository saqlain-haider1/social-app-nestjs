import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './entities/user.entity';
import { PaymentModule } from '../payment/payment.module';
import { postSchema } from '../post/entities/post.entity';
import { PostModule } from '../post/post.module';
import { FeedModule } from '../ feed/feed.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: userSchema },
      { name: 'post', schema: postSchema },
    ]),
    PaymentModule,
    PostModule,
    FeedModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
