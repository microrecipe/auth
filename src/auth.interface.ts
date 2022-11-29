export interface SignUp {
  name: string;
  email: string;
  password: string;
}

export interface SignIn {
  email: string;
  password: string;
}

export interface TokenPayload {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}
