export class TokenPayloadDto {
  sub: string;
  role: string;
  type: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}
