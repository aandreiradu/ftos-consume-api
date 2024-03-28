import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      secretOrKey: config.getOrThrow<string>('AUTH_RT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookieRefreshTokenName = config.get<string>('FTOS_SESSION');
          const data = request?.cookies[cookieRefreshTokenName];
          if (!data) {
            return null;
          }
          return data.token;
        },
      ]),
    });
  }

  validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
