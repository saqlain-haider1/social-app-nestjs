import { IsOptional, IsString } from 'class-validator';

export class SortPostDto {
  @IsString()
  @IsOptional()
  sortOrder?: string;
  @IsString()
  @IsOptional()
  sortBy?: string;
}
