export interface LoginVerifyCodeDTO {
  username: string;
  password: string;
  verifyCode: string;
  uuid: string;
  device?: string | 'web';
}
