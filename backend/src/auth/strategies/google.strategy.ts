import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleOAuth2Strategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('oauth.googleId') || '',
      clientSecret: configService.get<string>('oauth.googleSecret') || '',
      scope: ['email', 'profile'],
      callbackURL: configService.get<string>('oauth.callbackUrl'),
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { name, photos, emails } = profile;

    if (!emails) {
      done(
        {
          message: 'Email not found',
        },
        undefined,
      );
      return;
    }
    const user = {
      email: emails[0].value,
      username: `${name?.givenName} ${name?.familyName}`,
      profilePic: photos?.[0].value,
    };
    await this.authService.validateUser(user);
    done(null, user);
  }
}
