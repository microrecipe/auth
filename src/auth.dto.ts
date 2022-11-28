import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { User } from './auth.entity';

export class UserDTO {
  static toDTO(user: User) {
    const res = new UserDTO();

    res.id = user.id;
    res.name = user.name;
    res.email = user.email;

    return res;
  }

  id: number;
  name: string;
  email: string;
}

export class SignUpDTO extends UserDTO {}

export class SignUpBody {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class SignInDTO {
  static toDTO(accessToken: string, refreshToken: string, user: User) {
    const res = new SignInDTO();

    res.accessToken = accessToken;
    res.refreshToken = refreshToken;
    res.user = UserDTO.toDTO(user);

    return res;
  }

  @Expose({ name: 'access_token' })
  accessToken: string;

  @Expose({ name: 'refresh_token' })
  refreshToken: string;

  user: UserDTO;
}

export class SignInBody {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
