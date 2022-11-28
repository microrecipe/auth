import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt/dist';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignInDTO, SignUpDTO } from './auth.dto';
import { User } from './auth.entity';
import { SignIn, SignUp } from './auth.interface';

@Injectable()
export class AppService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(data: SignUp): Promise<SignUpDTO> {
    const user = await this.usersRepository.save(
      this.usersRepository.create({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    );

    return SignUpDTO.toDTO(user);
  }

  async signIn(data: SignIn) {
    const user = await this.usersRepository.findOneOrFail({
      where: {
        email: data.email,
        password: data.password,
      },
    });

    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get('JWT_TOKEN_SECRET_KEY'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRY_SECONDS'),
    });

    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRY_SECONDS'),
    });

    return SignInDTO.toDTO(accessToken, refreshToken, user);
  }
}
