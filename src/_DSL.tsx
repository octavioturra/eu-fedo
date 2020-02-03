export class AuthPair {
  constructor(public user: string, public password: string) {}
}
export class AdminKey {
  constructor(public encryptedKey: JsonWebKey) {}
}
export class AdminKeyPair {
  constructor(public publicKey: JsonWebKey, public privateKey: JsonWebKey) {}
}
export class SecuredPrivateKey {
  constructor(public encryptedKey: string) {}
}
export class EncryptKey {
  constructor(public key: JsonWebKey) {}
}
export class Identity {
  constructor(public fingerprint: string) {}
}
export class IdentityToken {
  constructor(public token: string) {}
}
export class Answer {
  constructor(public level: number) {}
}
export class AnswerPair {
  constructor(public identityToken: IdentityToken, public answer: Answer) {}
}
export class EncryptedAnswer {
  constructor(
    public identityToken: IdentityToken,
    public encryptedData: string
  ) {}
}
export class Poll {
  constructor(public name: string, public description: string) {}
}
