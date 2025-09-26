import { CanActivate, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class authGuard implements CanActivate {
  constructor(private jwtService: JwtService) {
      async canActivate(context: ExecutionContext): Promise<boolean> {}

  }
}
