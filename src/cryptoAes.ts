import BufferUtils from "./utilsBuffer";

export default class CryptoAES {
  // source: https://github.com/diafygi/webcrypto-examples
  key: CryptoKey | null = null;
  counter: Uint8Array | null = null;

  static async importKey(key: JsonWebKey | ArrayBuffer, type = "jwk") {
    const importedKey = window.crypto.subtle.importKey(
      type, //can be "jwk" or "raw"
      key,
      {
        //this is the algorithm options
        name: "AES-GCM",
        length: 256
      },
      true, //whether the key is extractable (i.e. can be used in exportKey)
      ["encrypt", "decrypt"] //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
    );
    return importedKey;
  }
  async withPassword(password: string): Promise<this> {
    const key = await window.crypto.subtle.digest(
      { name: "SHA-256" },
      BufferUtils.fromString(password)
    );
    this.key = await CryptoAES.importKey(key, "raw");
    return this;
  }
  async withUser(user: string): Promise<this> {
    this.counter = BufferUtils.fromString(user.substr(0, 16).padStart(16));
    return this;
  }
  async encrypt(data: string): Promise<string> {
    console.log(this.key);
    if (!this.counter) 
      throw new Error("counter not found")
    if (!this.key) 
      throw new Error("key not found")
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        counter: this.counter,
        iv: this.counter
      },
      this.key, //from generateKey or importKey above
      BufferUtils.fromString(data) //ArrayBuffer of data you want to encrypt
    );
    return BufferUtils.toString(encryptedData);
  }
  async decrypt(data: string): Promise<string> {
    if (!this.counter) 
      throw new Error("counter not found")
    if (!this.key) 
      throw new Error("key not found")

    const bdata = BufferUtils.fromString(data);

    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        counter: this.counter, //The same counter you used to encrypt
        // length: 128, //The same length you used to encrypt
        iv: this.counter
      },
      this.key, //from generateKey or importKey above
      bdata //ArrayBuffer of the data
    );

    return BufferUtils.toString(decryptedData);
  }
  async exportKey(): Promise<JsonWebKey> {
    if (!this.key) 
      throw new Error("key not found")
    return await window.crypto.subtle.exportKey(
      "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
      this.key
    );
  }
}
