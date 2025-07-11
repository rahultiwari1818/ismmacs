import crypto from 'crypto';

function padPKCS5(text) {
  const blockSize = 16;
  const padLength = blockSize - (Buffer.byteLength(text, 'utf8') % blockSize);
  const padding = String.fromCharCode(padLength).repeat(padLength);
  return text + padding;
}

export function encrypt(text, key) {
  const cipher = crypto.createCipheriv('aes-128-ecb', Buffer.from(key, 'utf8'), null);
  cipher.setAutoPadding(false); // because we manually pad
  const paddedText = padPKCS5(text);
  const encrypted = Buffer.concat([
    cipher.update(paddedText, 'utf8'),
    cipher.final()
  ]);
  return encrypted.toString('base64');
}
