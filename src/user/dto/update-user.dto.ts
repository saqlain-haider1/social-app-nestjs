import { IsEmail, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  public firstName?: string;
  @IsString()
  public lastName?: string;
  @IsString()
  @IsEmail()
  public email?: string;
}
