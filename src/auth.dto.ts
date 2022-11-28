import { IsEmail, IsString } from 'class-validator';
import { User } from './auth.entity';

export class SignUpDTO {
  static toDTO(user: User) {
    const res = new SignUpDTO();

    res.name = user.name;
    res.email = user.email;

    return res;
  }

  name: string;
  email: string;
}

export class SignUpBody {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
