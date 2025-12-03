import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(user: Partial<User>): Promise<Partial<User>> {
    const userData = await this.userService.validateUser(user.email!);
    if (!userData) {
      await this.userService.create(user as User);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async generateToken(user: User): Promise<string | null> {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }
}
