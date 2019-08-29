import aes from 'crypto-js/aes';
import Base64 from 'crypto-js/enc-base64';
import Hex from 'crypto-js/enc-hex';

// const key = encUtf8.parse('1234123412ABCDEF'); // 十六位十六进制数作为密钥

// AES加密方法
const aesEncrypt = (word) => {
  let encrypted = aes.encrypt(word.toString(), Hex.parse('000102030405060708090a0b0c0d0e0f'), {
    iv: Hex.parse('101112131415161718191a1b1c1d1e1f')
  });
  // return encrypted;
  // console.log('aaa', Base64.stringify(encrypted.iv), encrypted.toString())
  return {
    encrypt: encrypted.toString(),
    key: Base64.stringify(encrypted.key),
    iv: Base64.stringify(encrypted.iv),
    ciphertext: Base64.stringify(encrypted.ciphertext)
  }
}

export default aesEncrypt;
