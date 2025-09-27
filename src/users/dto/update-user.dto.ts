import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @IsString()
  fullName?: string;

  //   @IsNotEmpty()
  //   @IsEmail()
  //   email?: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password?: string;
}
