import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { MongooseModule } from '@nestjs/mongoose';
import { postSchema } from '../post/entities/post.entity';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Post', schema: postSchema }])],
  providers: [FeedService],
  exports: [FeedService],
})
export class FeedModule {}
