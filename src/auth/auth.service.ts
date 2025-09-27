import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateAuthDto } from './dto/update.auth.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sing-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(SignUpDto: SignUpDto) {
    const existUser = await this.usersService.findOneByEmail(SignUpDto.email);

    if (existUser) throw new BadRequestException('user already exist');

    const hashedPass = await bcrypt.hash(SignUpDto.password, 10);

    await this.usersService.create({
      ...SignUpDto,
      password: hashedPass,
    });

    return 'user registered succesfully';
  }

  async signIn(SignInDto: SignInDto) {
    const existUser = await this.usersService.findOneByEmail(SignInDto.email);

    if (!existUser) throw new BadRequestException('invalid Credentials');

    const isPassEqual = await bcrypt.compare(
      SignInDto.password,
      existUser.password,
    );

    if (!isPassEqual) throw new BadRequestException('invalid Credentials');

    const payLoad = {
      userId: existUser._id,
    };

    const accesToken = await this.jwtService.sign(payLoad, { expiresIn: '1h' });

    return { accesToken };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
