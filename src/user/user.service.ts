import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async signup(@Body() body: CreateUserDto): Promise<{ message: string }> {
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
      return { message: `Error:  ${err.message}` };
    }
  }

  async login(@Body() body: LoginUserDto): Promise<{ message: string }> {}

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
