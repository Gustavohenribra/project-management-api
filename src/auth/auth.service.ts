import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const existingUser = await this.usersService.findByEmail(user.email);
    if (!existingUser) {
      throw new Error('Invalid credentials');
    }
  
    const payload = { username: existingUser.email, sub: existingUser.id, role: existingUser.role };
    console.log(payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  

  async register(user: any) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return this.usersService.create({ ...user, password: hashedPassword });
  }
}