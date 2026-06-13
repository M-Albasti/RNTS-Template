export type LoginRequestDto = {
  email: string;
  password: string;
};

export type LoginResponseDto = {
  id: number;
  name: string;
  email: string;
  token: string;
};

export type RegisterRequestDto = {
  email: string;
  password: string;
  name?: string;
};

export type RegisterResponseDto = LoginResponseDto;
