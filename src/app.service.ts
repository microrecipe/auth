import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt/dist';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignInDTO, SignUpDTO } from './auth.dto';
import { User } from './auth.entity';
import { SignIn, SignUp, TokenPayload } from './auth.interface';

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

  async signIn(data: SignIn): Promise<SignInDTO> {
    const user = await this.usersRepository.findOneBy({
      email: data.email,
      password: data.password,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const tokenPayload: TokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get('JWT_TOKEN_SECRET_KEY'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRY_SECONDS',
      )}s`,
    });

    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRY_SECONDS',
      )}s`,
    });

    return SignInDTO.toDTO(user, accessToken, refreshToken);
  }

  async refreshToken(data: TokenPayload): Promise<SignInDTO> {
    const user = await this.usersRepository.findOneOrFail({
      where: {
        email: data.email,
      },
    });

    const tokenPayload: TokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get('JWT_TOKEN_SECRET_KEY'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRY_SECONDS',
      )}s`,
    });

    return SignInDTO.toDTO(user, accessToken);
  }
}
