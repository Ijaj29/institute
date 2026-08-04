var crypto = require("crypto");
var aes256 = require('aes256');
const nodeRsa = require('node-rsa');

let publicKey = '-----BEGIN PUBLIC KEY-----\n' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCy7Slfb0TW42NRNJwhVq7JHVwI\n' +
    'vf9JGsAbLwZQ9ZPUfhRVtlLZDJhTdMtXlamMUjEMK7AV1HG3udQKM0enDbHnD8c/\n' +
    'SAjk/yHFdu6K7FvPVEQcawXxtIqDSF7MMXbWak3JyAgziA/RNSPE1KuVPYYrB7qD\n' +
    '798AN+bkhZV4vgr5tQIDAQAB\n' +
    '-----END PUBLIC KEY-----'

let privateKey = '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIICWwIBAAKBgQCy7Slfb0TW42NRNJwhVq7JHVwIvf9JGsAbLwZQ9ZPUfhRVtlLZ\n' +
    'DJhTdMtXlamMUjEMK7AV1HG3udQKM0enDbHnD8c/SAjk/yHFdu6K7FvPVEQcawXx\n' +
    'tIqDSF7MMXbWak3JyAgziA/RNSPE1KuVPYYrB7qD798AN+bkhZV4vgr5tQIDAQAB\n' +
    'AoGAJ9VAhqyAyM4qiCOMNqfTlZZhrNiPgrjf161qXI+vb3j6EfLbEtMI/ltcAY2i\n' +
    'B0ks/iajtthq0JogKH0uEHSuDAEImhqcFt1hiA8cYOBFqn/hkEIEme4u6xeShMZA\n' +
    'jX0PtAjBBgSPnZjqHjsApeBwJ8grBmaVCfcukCzpQUBbdAECQQDotc0GjlRbfWp1\n' +
    'Hv0+iAkF4X0bvkVlh5iE2kQxngw+Dvb7eZnr8Safp2D/jUEySo9rmw4DtjCoHByK\n' +
    '38HKZpw1AkEAxNViDo5dzKiBmPtQZWMCQI7EKggfFSEBCfSKX0Z1XGgSscxHdyx9\n' +
    'chUgrkpslu+F/LftfVjXxPutJIzUOceXgQJAYMC1rbQffqp2SJvJzuXgWoGV8qL5\n' +
    'V205DINzNu3vSR4Psh6s0FxDIr4Epjukj7RQTPz6prBpKnwFoffGKtDewQJAPzTa\n' +
    'YRw8aLzvqOWC4pvRnFN8EJc9C/bmM4EwcfnZNAxDfI7BoDZMLjc0oGNLzYgq+YVC\n' +
    'oQ7Hcvzyk5sZh1hdgQJAO8pxuR8ZHHb2JmE6U/vNWgcau9Yf1UtsiH24KOo+khmb\n' +
    'coMJg90u88HX8DeIyKH1Y85KK/PCjnifVMy6eNJOtQ==\n' +
    '-----END RSA PRIVATE KEY-----'

let keyPublic = new nodeRsa(publicKey);
let keyPrivate = new nodeRsa(privateKey);


exports.AES_Symetric_Encrypt = (key, plaintext) => {
    return(aes256.encrypt(key, plaintext));
}
exports.AES_Symetric_Decrypt = (key, encryptedPlainText) => {
    let decryptData = aes256.decrypt(key, encryptedPlainText);
    return(decryptData);
}

exports.publicPrivateKey = () => {
  const key = new nodeRsa({ b: 512 })
  publicKey = key.exportKey('public');
  privateKey = key.exportKey('private');
  return ({ publicKey, privateKey })
}

exports.encryptWithPrivate = ( text) => {
//   let keyPrivate = new nodeRsa(privateKey);
  const encryptWithPrivate = keyPrivate.encryptPrivate(text, 'base64');
  return (encryptWithPrivate)
};

exports.decryptWithPublic = ( encryptedString) => {
//   let keyPublic = new nodeRsa(publicKey);
  const decryptWithPublic = keyPublic.decryptPublic(encryptedString, 'utf-8');
  return (decryptWithPublic)
};

exports.encryptWithPublic = ( text) => {
//   let keyPublic = new nodeRsa(publicKey);
  const encryptWithPublic = keyPublic.encrypt(text, 'base64');
  return (encryptWithPublic)
};

exports.decryptWithPrivate = ( encryptedString) => {
//   let keyPrivate = new nodeRsa(privateKey);
  const decryptWithPrivate = keyPrivate.decrypt(encryptedString, 'utf-8');
  return (decryptWithPrivate)
};


