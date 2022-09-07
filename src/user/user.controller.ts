import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Card } from 'src/payment/interfaces/card.interface';
import { PaginationPostDto } from '../post/dto/pagination-post.dto';
import { SortPostDto } from '../post/dto/sort-post.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.signup(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.userService.login(loginUserDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }

  @Put('follow/:id')
  async follow(@Param('id') id: string, @Body() userData) {
    return await this.userService.followUser(id, userData);
  }

  @Put('unfollow/:id')
  async unFollow(@Param('id') id: string, @Body() userData) {
    return await this.userService.unfollowUser(id, userData);
  }

  @Post('payment/:id')
  async payment(@Param('id') id: string, @Body() card: Card) {
    return await this.userService.payment(id, card);
  }
  @Get('feed/:id')
  async feed(
    @Param('id') id: string,
    @Body() paginationDetails: PaginationPostDto,
    @Body() sortingDetails: SortPostDto,
  ) {
    return await this.userService.getFeed(
      id,
      paginationDetails,
      sortingDetails,
    );
  }
}
