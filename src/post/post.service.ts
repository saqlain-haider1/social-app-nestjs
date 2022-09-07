import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { SocketsGateway } from '../socket/socket.gateway';
import { User } from '../user/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginationPostDto } from './dto/pagination-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Post') private readonly postModel: Model<Post>,
    private readonly socket: SocketsGateway,
  ) {}
  async create(
    id: string,
    createPostDto: CreatePostDto,
  ): Promise<{
    message: string;
    CreatedPost: Post;
  }> {
    try {
      const user = await this.userModel.findOne({ _id: id });
      if (!user) {
        throw new BadRequestException('User not found!');
      } else {
        const { title, description } = createPostDto;
        const userId = user._id;
        const post = await new this.postModel({
          userId: userId,
          title,
          description,
        });
        post.save();
        // Signaling new post to the socket
        this.socket.handleNewPost(post);
        return {
          message: 'Post created successfully!',
          CreatedPost: post,
        };
      }
    } catch (err) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getPost(
    userId: string,
    pagination: PaginationPostDto,
  ): Promise<{
    pagination: PaginationPostDto;
    posts: Post[];
  }> {
    try {
      // Pagination of posts
      const posts = await this.postModel
        .find({ userId: userId })
        .limit(pagination.limit)
        .skip(pagination.skip);
      return {
        pagination,
        posts: posts,
      };
    } catch (err) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<{
    message: string;
    Updated: Post & {
      _id: mongoose.Types.ObjectId;
    };
  }> {
    try {
      const post = await this.postModel.findOne({ _id: id });
      if (post) {
        // Post found in the database
        const { title, description } = updatePostDto;
        const updatedPost = await this.postModel.findByIdAndUpdate(
          post._id,
          { title, description },
          { new: true },
        );
        return { message: 'Post updated successfully!', Updated: updatedPost };
      } else {
        throw new BadRequestException('Post not found!');
      }
    } catch (err) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string): Promise<{
    message: string;
    DeletedPost: Post;
  }> {
    try {
      const post = await this.postModel.findOne({ _id: id });
      if (post) {
        // Post found in the database
        const deletedPost = await this.postModel.findByIdAndDelete(id);
        return {
          message: 'Post deleted successfully!',
          DeletedPost: deletedPost,
        };
      } else {
        throw new BadRequestException('Post not found!');
      }
    } catch (err) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
