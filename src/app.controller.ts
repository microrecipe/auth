import {
  Controller,
  Body,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { RefreshTokenPayload } from './auth.decorator';
import { SignInBody, SignInDTO, SignUpBody, SignUpDTO } from './auth.dto';
import { JwtAuthGuard } from './auth.guard';
import { TokenPayload } from './auth.interface';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AppController {
  constructor(private readonly service: AppService) {}

  @Post('sign-up')
  async signUp(@Body() body: SignUpBody): Promise<SignUpDTO> {
    return await this.service.signUp(body);
  }

  @Post('sign-in')
  async signIn(@Body() body: SignInBody): Promise<SignInDTO> {
    return await this.service.signIn(body);
  }

  @Post('refresh-token')
  @UseGuards(JwtAuthGuard)
  async refreshToken(
    @RefreshTokenPayload() payload: TokenPayload,
  ): Promise<SignInDTO> {
    return await this.service.refreshToken(payload);
  }
}
