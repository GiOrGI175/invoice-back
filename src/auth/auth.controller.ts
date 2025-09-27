import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateAuthDto } from './dto/update.auth.dto';
import { SignInDto } from './dto/sing-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() createAuthDto: SignUpDto) {
    return this.authService.signUp(createAuthDto);
  }

  @Post('sign-in')
  signIn(@Body() SignInDto: SignInDto) {
    return this.authService.signIn(SignInDto);
  }
}
