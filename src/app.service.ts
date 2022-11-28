import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDTO } from './auth.dto';
import { User } from './auth.entity';
import { SignUp } from './auth.interface';

@Injectable()
export class AppService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
}
