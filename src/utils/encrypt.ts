import { SHA256 } from 'crypto-js';

export function encryptSha256 (str: string): string {
  try {
    return SHA256(str).toString();
  } catch (e) {
    console.error(e);
    return "";
  }
}
