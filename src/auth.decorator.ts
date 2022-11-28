import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from './auth.interface';

export const RefreshTokenPayload = createParamDecorator(
  (data: any, context: ExecutionContext): TokenPayload => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
