import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
   ) {}

   async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException();
    }
  
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  
  async signUp(username: string, password: string): Promise<any> {
    const user = await this.usersService.create(username, password);
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}