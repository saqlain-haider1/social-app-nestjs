import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PaginationPostDto } from '../post/dto/pagination-post.dto';
import { SortPostDto } from '../post/dto/sort-post.dto';
import { Post } from '../post/entities/post.entity';

@Injectable()
export class FeedService {
  constructor(@InjectModel('Post') private readonly postModel: Model<Post>) {}

  async getFeed(
    following: Array<mongoose.Types.ObjectId>,
    pagination: PaginationPostDto,
    sortingDetails: SortPostDto,
  ): Promise<{
    'Pagination Details': {
      TOTAL_POSTS: number;
      POSTS_PER_PAGE: number;
      'Current Page No': number;
      'Has Next Page? ': boolean;
    };
    posts: Post[];
  }> {
    try {
      const { sortOrder = -1, sortBy = 'createdAt' } = sortingDetails;
      const { limit = 5, pageNo = 1 } = pagination;
      const sortQuery = {};
      sortQuery[sortBy] = sortOrder;
      const posts = await this.postModel
        .find({ userId: { $in: following } })
        .sort(sortQuery)
        .skip(limit * (pageNo - 1))
        .limit(limit);
      const totalPosts = await this.postModel
        .find({
          userId: { $in: following },
        })
        .sort(sortQuery)
        .count();
      return {
        'Pagination Details': {
          TOTAL_POSTS: totalPosts,
          POSTS_PER_PAGE: limit,
          'Current Page No': pageNo,
          'Has Next Page? ': pageNo * limit < totalPosts,
        },
        posts: posts,
      };
    } catch (err) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
