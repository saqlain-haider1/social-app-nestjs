import {
  BadRequestException,
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { PaginationPostDto } from '../post/dto/pagination-post.dto';
import { SortPostDto } from '../post/dto/sort-post.dto';
import { Post } from '../post/entities/post.entity';
import { User } from '../user/entities/user.entity';
import { CreateModeratorDto } from './dto/create-moderator.dto';
import { UpdateModeratorDto } from './dto/update-moderator.dto';
import { Moderator } from './entities/moderator.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ModeratorService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Post') private readonly postModel: Model<Post>,
    @InjectModel('Moderator') private readonly moderatorModel: Model<Moderator>,
  ) {}
  async create(createModeratorDto: CreateModeratorDto): Promise<{
    message: string;
  }> {
    try {
      // If user object is present in the request body
      const { firstName, lastName, email, password } = createModeratorDto;
      const moderator = await this.moderatorModel.findOne({ email: email });
      // If user email is already present in the database
      if (moderator) {
        throw new BadRequestException(
          `Moderator: ${moderator.email} already exists  in the database!`,
        );
      } else {
        // create new user object
        const hashValue = await bcrypt.hash(password, 10);
        const newModerator = new this.moderatorModel({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hashValue,
        });
        // save it in the database
        await newModerator.save();
        return { message: 'Moderator created successfully!' };
      }
    } catch (err) {
      // Send error back to user
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async login(
    @Body() loginDetails: LoginUserDto,
  ): Promise<{ message?: string; AccessToken?: string }> {
    try {
      const { email, password } = loginDetails;
      const user = await this.userModel.findOne({ email });
      if (user) {
        const result = bcrypt.compare(password, user.password);
        if (result) {
          const token = jwt.sign(
            {
              userId: user._id,
              email: user.email,
            },
            process.env.JWT_SECRET,
            {},
          );
          return { AccessToken: token };
        } else {
          return { message: 'Auth Failed!' };
        }
      } else {
        throw new BadRequestException('Email or Password is incorrect !');
      }
    } catch (err) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllPosts(
    pagination: PaginationPostDto,
    sortingDetail: SortPostDto,
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
      const { sortOrder = -1, sortBy = 'createdAt' } = sortingDetail;
      const { limit = 5, pageNo = 1 } = pagination;
      const sortQuery = {};
      sortQuery[sortBy] = sortOrder;

      const posts = await this.postModel
        .find({})
        .sort(sortQuery)
        .skip(limit * (pageNo - 1))
        .limit(limit);
      const totalPosts = await this.postModel.find({}).sort(sortQuery).count();
      return {
        'Pagination Details': {
          TOTAL_POSTS: totalPosts,
          POSTS_PER_PAGE: limit,
          'Current Page No': pageNo,
          'Has Next Page? ': pageNo * limit < totalPosts,
        },
        posts,
      };
    } catch (err) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getOnePost(id: string): Promise<Post> {
    try {
      const post = await this.postModel.findById(id);
      return post;
    } catch (err) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: string,
    updateModeratorDto: UpdateModeratorDto,
  ): Promise<{
    message: string;
    updatedUser: Moderator;
  }> {
    try {
      const moderator = await this.moderatorModel.findOne({ _id: id });
      if (moderator) {
        // User found in the database
        const moderatorUser = await this.moderatorModel.findByIdAndUpdate(
          moderator._id,
          { ...updateModeratorDto },
          { new: true },
        );
        return {
          message: 'Moderator Updated Successfuly!',
          updatedUser: moderatorUser,
        };
      } else {
        throw new NotFoundException('Moderator not found!');
      }
    } catch (err) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removePost(id: string): Promise<{
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
