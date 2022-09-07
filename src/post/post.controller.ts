import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationPostDto } from './dto/pagination-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post(':id')
  create(@Param('id') id: string, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(id, createPostDto);
  }

  @Get(':userId')
  get(@Param('userId') userId: string, @Body() pagination: PaginationPostDto) {
    return this.postService.getPost(userId, pagination);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
