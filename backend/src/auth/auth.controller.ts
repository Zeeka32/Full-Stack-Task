import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() body: { username: string, password: string }) {
    const user = await this.authService.signIn(body.username, body.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('signup')
  async signUp(@Body() body: { username: string, password: string }) {
    return this.authService.signUp(body.username, body.password);
  }
}