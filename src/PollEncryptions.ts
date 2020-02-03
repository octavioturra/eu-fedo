import {
  AuthPair,
  AdminKey,
  AdminKeyPair,
  SecuredPrivateKey,
  AnswerPair,
  EncryptedAnswer,
  Answer
} from "./_DSL";

import CryptoAES from "./cryptoAes";
import CryptoRSA from "./cryptoRsa";

const aes = new CryptoAES();

export async function authenticate(auth: AuthPair): Promise<AdminKey> {
  await aes.withUser(auth.user);
  await aes.withPassword(auth.password);

  const encryptKey = await aes.exportKey();

  return new AdminKey(encryptKey);
}

// AUTH KEY

export async function generateAdminKeyPair(): Promise<AdminKeyPair> {
  const key = await CryptoRSA.createKey();
  const publicKey = await CryptoRSA.exportKey(key.publicKey);
  const privateKey = await CryptoRSA.exportKey(key.privateKey);

  return new AdminKeyPair(publicKey, privateKey);
}

// PRIVATE KEY

export async function generateSecuredPrivateKey(
  privateKey: JsonWebKey
): Promise<SecuredPrivateKey> {
  const privateKeyText = JSON.stringify(privateKey);
  const encrypted = await aes.encrypt(privateKeyText);
  return new SecuredPrivateKey(encrypted);
}

export async function generateUnsecuredPrivatekey(
  securePrivateKey: SecuredPrivateKey,
  auth: AuthPair
): Promise<JsonWebKey> {
  await aes.withUser(auth.user);
  await aes.withPassword(auth.password);

  const securePrivateKeyText = securePrivateKey.encryptedKey;
  const decrypted = await aes.decrypt(securePrivateKeyText);

  return JSON.parse(decrypted);
}

// ENCRYPT & DECRYPT ANSWER

export async function encryptAnswerPair(
  publicKey: JsonWebKey,
  answer: AnswerPair
): Promise<EncryptedAnswer> {
  const partialKeyPair: CryptoKeyPair = {
    publicKey: await CryptoRSA.importEncryptKey(publicKey),
    privateKey: null
  };
  const rsa = new CryptoRSA(partialKeyPair);
  const data = JSON.stringify(answer);
  const encrypted = await rsa.encrypt(data);
  return new EncryptedAnswer(answer.identityToken, encrypted);
}

export async function decryptAnswerPair(
  privateKey: JsonWebKey,
  encryptedAnswer: EncryptedAnswer
): Promise<AnswerPair> {
  const partialKeyPair: CryptoKeyPair = {
    publicKey: null,
    privateKey: await CryptoRSA.importDecryptKey(privateKey)
  };
  const rsa = new CryptoRSA(partialKeyPair);
  const decrypted = await rsa.decrypt(encryptedAnswer.encryptedData);
  const level = parseInt(decrypted, 10);
  const answer = new Answer(level);
  const pair = new AnswerPair(encryptedAnswer.identityToken, answer);
  return pair;
}

/*
POLL DATABASE
*/

export async function generatePollId(auth: AuthPair): Promise<string> {
  const envelope = btoa(`${auth.user}-${auth.password}`);
  const encryptedEnvelope = await aes.encrypt(envelope);
  return btoa(encryptedEnvelope);
}

export async function isAuthValidForPollId(
  pollId: string,
  auth: AuthPair
): Promise<boolean> {
  const cleanPollId = atob(pollId);
  const decryptedEnvelope = await aes.decrypt(cleanPollId);
  const envelope = btoa(`${auth.user}-${auth.password}`);
  return envelope === decryptedEnvelope;
}
