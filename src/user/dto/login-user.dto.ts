import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}
