import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public firstName: string;
  @IsString()
  public lastName: string;
  @IsString()
  @IsEmail()
  public email: string;
  @IsString()
  public password: string;
}
