export interface LoginVerifyCodeDTO {
  username: string;
  password: string;
  verifyCode: string;
  uuid: string;
  device?: string | 'web';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
