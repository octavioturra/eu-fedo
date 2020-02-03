export default class BufferUtils {
  // source: http://qnimate.com/passphrase-based-encryption-using-web-cryptography-api/
  static fromString(str: String): Uint8Array {
    var bytes = new Uint8Array(str.length);
    for (var iii = 0; iii < str.length; iii++) {
      bytes[iii] = str.charCodeAt(iii);
    }

    return bytes;
  }
  static toString(buffer: ArrayBuffer) {
    return Array.from(new Uint8Array(buffer))
      .map(d => String.fromCharCode(d))
      .join("");
  }
}
