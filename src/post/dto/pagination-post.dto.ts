import { IsNumber, IsOptional } from 'class-validator';

export class PaginationPostDto {
  @IsNumber()
  @IsOptional()
  limit?: number;
  @IsNumber()
  @IsOptional()
  skip?: number;
  @IsNumber()
  @IsOptional()
  pageNo?: number;
}
