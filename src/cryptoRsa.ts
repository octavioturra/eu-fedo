import BufferUtils from "./utilsBuffer";

export default class CryptoRSA {
  // source: https://github.com/diafygi/webcrypto-examples
  static async importEncryptKey(key: JsonWebKey | ArrayBuffer, type = "jwk") {
    const importedKey = window.crypto.subtle.importKey(
      type, //can be "jwk" or "raw"
      key,
      {
        //this is the algorithm options
        name: "RSA-OAEP",
        hash: { name: "SHA-256" },
        length: 256
      },
      true, //whether the key is extractable (i.e. can be used in exportKey)
      ["encrypt"] //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
    );
    return importedKey;
  }
  static async importDecryptKey(key: JsonWebKey | ArrayBuffer, type = "jwk") {
    const importedKey = window.crypto.subtle.importKey(
      type, //can be "jwk" or "raw"
      key,
      {
        //this is the algorithm options
        name: "RSA-OAEP",
        hash: { name: "SHA-256" },
        length: 256
      },
      true, //whether the key is extractable (i.e. can be used in exportKey)
      ["decrypt"] //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
    );
    return importedKey;
  }

  static async createKey(): Promise<CryptoKeyPair> {
    return window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048, //can be 1024, 2048, or 4096
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: "SHA-256" } //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
      },
      true, //whether the key is extractable (i.e. can be used in exportKey)
      ["encrypt", "decrypt"] //must be ["encrypt", "decrypt"] or ["wrapKey", "unwrapKey"]
    );
  }
  constructor(private keyPair: CryptoKeyPair) {}
  async encrypt(data: string): Promise<string> {
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      this.keyPair.publicKey, //from generateKey or importKey above
      BufferUtils.fromString(data) //ArrayBuffer of data you want to encrypt
    );
    return BufferUtils.toString(encrypted);
  }
  async decrypt(data: string): Promise<string> {
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP"
        //label: Uint8Array([...]) //optional
      },
      this.keyPair.privateKey, //from generateKey or importKey above
      BufferUtils.fromString(data) //ArrayBuffer of data you want to encrypt
    );
    return BufferUtils.toString(decrypted);
  }
  static async exportKey(key: CryptoKey): Promise<JsonWebKey> {
    return await window.crypto.subtle.exportKey(
      "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
      key
    );
  }
}
