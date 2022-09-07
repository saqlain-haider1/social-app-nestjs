import {
  BadRequestException,
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { PaymentService } from '../payment/payment.service';
import { PaginationPostDto } from '../post/dto/pagination-post.dto';
import { SortPostDto } from '../post/dto/sort-post.dto';
import { FeedService } from '../ feed/feed.service';
import * as jwt from 'jsonwebtoken';
import { Card } from '../payment/interfaces/card.interface';
import { Post } from 'src/post/entities/post.entity';

export type UserId = { userId: string };
export interface RequestBody {
  userData: UserId;
}
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private feedService: FeedService,
    private paymentService: PaymentService,
  ) {}

  async signup(@Body() body: CreateUserDto): Promise<{
    message: string;
  }> {
    try {
      // If user object is present in the request body
      const { firstName, lastName, email, password } = body;
      const user = await this.userModel.findOne({ email: email });
      // If user email is already present in the database
      if (user) {
        throw new BadRequestException(
          `User: ${user.email} already exists  in the database`,
        );
      } else {
        // create new user object
        const hashValue = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hashValue,
        });
        // save it in the database
        await newUser.save();
        console.log('Created User: ' + user);
        return { message: 'User created successfully' };
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

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id);
      if (user) {
        return user;
      } else {
        throw new NotFoundException('User not found!');
      }
    } catch (err) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string; updatedUser: User }> {
    try {
      const user = await this.userModel.findOne({ _id: id });
      if (user) {
        // User found in the database
        const updatedUser = await this.userModel.findByIdAndUpdate(
          user._id,
          { ...updateUserDto },
          { new: true },
        );
        return {
          message: 'User Updated Successfuly!',
          updatedUser: updatedUser,
        };
      } else {
        throw new NotFoundException('User not found!');
      }
    } catch (err) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string): Promise<{ message: string; DeletedUser: User }> {
    try {
      const user = await this.userModel.findOne({ _id: id });
      if (user) {
        // User found in the database
        const deletedUser = await this.userModel.findByIdAndDelete(id);
        return {
          message: 'User deleted successfully!',
          DeletedUser: deletedUser,
        };
      } else {
        throw new NotFoundException('User not found!');
      }
    } catch (err) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async followUser(
    id: string,
    @Body() body: RequestBody,
  ): Promise<{ message: string }> {
    try {
      const userToFollow = await this.userModel.findById(id);
      if (userToFollow) {
        // User 1 found in the database
        const followUser = await this.userModel.findOne({
          _id: body.userData.userId,
        });
        if (followUser) {
          // User 2 found in the database
          if (followUser.following.includes(userToFollow._id)) {
            return { message: 'User is already followed!' };
          }
          followUser.following.push(userToFollow._id);
          await followUser.save();
          userToFollow.followers.push(followUser._id);
          await userToFollow.save();
          return { message: 'User followed successfully!' };
        } else {
          throw new BadRequestException('Following User not exists!');
        }
      } else {
        throw new BadRequestException('User to follow not exists!');
      }
    } catch (err) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async unfollowUser(
    id: string,
    @Body() userData: RequestBody,
  ): Promise<{ message: string }> {
    try {
      const userToUnfollow = await this.userModel.findById(id);
      if (userToUnfollow) {
        // User 1 found in the database
        const followingUser = await this.userModel.findById(
          userData.userData.userId,
        );
        if (followingUser) {
          // User 2 found in the database
          const userToUnfollowIndex = followingUser.following.indexOf(
            userToUnfollow._id,
          );
          if (userToUnfollowIndex === -1) {
            throw new Error('User not followed!');
          }
          const followingUserIndex = userToUnfollow.followers.indexOf(
            followingUser._id,
          );
          followingUser.following.splice(userToUnfollowIndex, 1);
          await followingUser.save();
          userToUnfollow.followers.splice(followingUserIndex, 1);
          await userToUnfollow.save();
          return { message: 'User unfollowed successfully!' };
        } else {
          throw new BadRequestException('Following User not exists!');
        }
      } else {
        throw new BadRequestException('User to unfollow not exists!');
      }
    } catch (err) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async payment(
    id: string,
    cardDetails: Card,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.userModel.findById(id);
      if (user) {
        // User found in database
        if (user.paid) {
          // User has already paid
          return {
            success: true,
            message: 'User has already paid for the feed!',
          };
        } else {
          const { firstName, lastName, email } = user;
          const result = await this.paymentService.payment(
            { name: `${firstName} ${lastName}`, email },
            cardDetails,
          );
          if (result.success) {
            // User paid for the feed
            await this.userModel.findByIdAndUpdate(
              user._id,
              { paid: true },
              { new: true },
            );
            return result;
          } else {
            throw new BadRequestException(result);
          }
        }
      }
    } catch (err) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async getFeed(
    id: string,
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
      const user = await this.userModel.findOne({ _id: id });
      if (user) {
        // User found in database
        if (user.paid) {
          // User is paid for the feed
          // Fetch the feed using feed service and return it.
          return this.feedService.getFeed(
            user.following,
            pagination,
            sortingDetails,
          );
        } else {
          throw new BadRequestException(
            `User did not paid for the social feed yet.
            Please pay first!`,
          );
        }
      } else {
        throw new BadRequestException('User not found');
      }
    } catch (err) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
