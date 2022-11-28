import { Controller, Body, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SignUpBody, SignUpDTO } from './auth.dto';

@Controller('auth')
export class AppController {
  constructor(private readonly service: AppService) {}

  @Post('sign-up')
  async signUp(@Body() body: SignUpBody): Promise<SignUpDTO> {
    return await this.service.signUp(body);
  }
}
