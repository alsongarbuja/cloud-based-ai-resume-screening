import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleOAuthGuard } from './guards/google.guard';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User & { redirectTo: string };
    const u = await this.authService.validateUser({
      email: user.email,
      username: user.username,
      type: user.type,
      profilePic: user.profilePic,
    });

    const token = await this.authService.generateToken(u as User);

    if (token) {
      res.cookie('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 1000 * 60 * 5,
      });

      res.redirect(
        `${this.configService.get<string>('client.url')}${user.redirectTo || ''}`,
      );
    }

    res.redirect(`${this.configService.get<string>('client.url')}/auth/error`);
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: this.configService.get<string>('oauth.domain') || 'localhost',
      path: '/',
      expires: new Date(0),
    });

    res.redirect(
      this.configService.get<string>('client.url') || 'http://localhost:3000',
    );
  }
}
