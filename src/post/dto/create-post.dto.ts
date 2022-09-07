import { IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  public title: string;
  @IsString()
  public description: string;
}
