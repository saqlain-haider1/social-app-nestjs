import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ModeratorService } from './moderator.service';
import { CreateModeratorDto } from './dto/create-moderator.dto';
import { UpdateModeratorDto } from './dto/update-moderator.dto';
import { PaginationPostDto } from '../post/dto/pagination-post.dto';
import { SortPostDto } from '../post/dto/sort-post.dto';

@Controller('moderator')
export class ModeratorController {
  constructor(private readonly moderatorService: ModeratorService) {}

  @Post()
  create(@Body() createModeratorDto: CreateModeratorDto) {
    return this.moderatorService.create(createModeratorDto);
  }

  @Get()
  async findAll(
    @Body() pagination: PaginationPostDto,
    @Body() sortingDetails: SortPostDto,
  ) {
    return await this.moderatorService.getAllPosts(pagination, sortingDetails);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moderatorService.getOnePost(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateModeratorDto: UpdateModeratorDto,
  ) {
    return this.moderatorService.update(id, updateModeratorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moderatorService.removePost(id);
  }
}
