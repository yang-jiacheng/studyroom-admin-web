import CryptoJS from 'crypto-js';

/**
 * 3DES 对称加密工具（与后端 Java DESUtil 保持一致）
 */

/**
 * 密钥校验和解析辅助函数
 * @param secretKey 密钥
 * @returns 解析后的密钥 WordArray
 */
function validateAndParseKey (secretKey: string): CryptoJS.lib.WordArray {
  if (!secretKey || secretKey.length < 24) {
    throw new Error('3DES 密钥长度不得小于 24 位');
  }
  return CryptoJS.enc.Utf8.parse(secretKey);
}

/**
 * 加密
 * @param plainText 明文
 * @param secretKey 密钥（长度>=24，与后端配置一致）
 * @returns Base64(IV + 密文)
 */
export function desEncode (plainText: string, secretKey: string): string {
  const keyWordArray = validateAndParseKey(secretKey);

  // 生成随机 IV（8 字节）
  const ivWordArray = CryptoJS.lib.WordArray.random(8);

  // 加密
  const encrypted = CryptoJS.TripleDES.encrypt(plainText, keyWordArray, {
    iv: ivWordArray,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  // 拼接 IV + 密文（先解 Base64 再拼接）
  const cipherBytes = encrypted.ciphertext;
  const combined = ivWordArray.concat(cipherBytes);

  return CryptoJS.enc.Base64.stringify(combined);
}

/**
 * 解密
 * @param encryptText Base64(IV + 密文)
 * @param secretKey 密钥（长度>=24，与后端配置一致）
 * @returns 解密后的明文
 */
export function desDecode (encryptText: string, secretKey: string): string {
  const keyWordArray = validateAndParseKey(secretKey);

  // Base64 解码
  const combined = CryptoJS.enc.Base64.parse(encryptText);

  // 提取 IV（前 8 字节）
  const ivBytes = CryptoJS.lib.WordArray.create(
    combined.words.slice(0, 2),
    8
  );

  // 提取密文
  const cipherBytes = CryptoJS.lib.WordArray.create(
    combined.words.slice(2),
    combined.sigBytes - 8
  );

  // 创建正确的 CipherParams 对象
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: cipherBytes
  });

  // 解密
  const decrypted = CryptoJS.TripleDES.decrypt(
    cipherParams,
    keyWordArray,
    {
      iv: ivBytes,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );

  return CryptoJS.enc.Utf8.stringify(decrypted);
}
