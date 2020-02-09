import { SecuredPrivateKey, EncryptedAnswer, Poll } from "./_DSL";

import getDatabase from "./getDatabase";
import getFilesystem from "./getFilesystem";
import Database, { Data } from "./database";
import timeout from "./utilsTimeout";

export class ItemNotFoundError extends Error {}

let db: PollDatabase | null = null;
let __identity: string = "";
export function getDatabaseInstance(
  pollId: string,
  identity: string
): PollDatabase {
  __identity = identity;
  if (!db) {
    db = new PollDatabase(pollId);
  }
  return db;
}
export default class PollDatabase {
  private database: Database | null = null;
  prepared = false;
  constructor(private pollId: string) {
    console.log("construindo PollDatabase");
    this.prepare();
  }
  async prepare(): Promise<this> {
    console.log("pegando filesystem");
    const filesystem = await getFilesystem();
    console.log("criando banco", this.pollId);
    this.database = await getDatabase(this.pollId, filesystem);
    console.log("banco criado", this.pollId);
    this.prepared = true;
    return this;
  }
  async waitPrepared(to = 120): Promise<boolean> {
    console.log("preparando");
    if (to <= 0) {
      throw new Error("timeout");
    }
    if (this.prepared) {
      console.log("preparado");
      return this.prepared;
    }
    await timeout(100);
    return this.waitPrepared(to - 1);
  }
  async createPoll(name: string, description: string = "") {
    if (!this.database) throw new Error("this.database is undefined");
    const poll = new Poll(name, description);
    const data = new Data("poll", poll, __identity);
    await this.database.add(data);
  }
  async persistSecuredPrivateKey(securedKey: SecuredPrivateKey) {
    if (!this.database) throw new Error("this.database is undefined");
    await this.database.add(
      new Data<SecuredPrivateKey>("admin-key", securedKey, __identity)
    );
  }

  async retrievePoll(): Promise<Poll> {
    if (!this.database) throw new Error("this.database is undefined");
    const polls = await this.database.getDataOfType<Poll>("poll");

    if (!polls.length) {
      throw new ItemNotFoundError("Poll not found");
    }

    return polls[0];
  }

  async retrieveSecuredPrivateKey() {
    if (!this.database) throw new Error("this.database is undefined");
    const adminKeys = await this.database.getDataOfType<SecuredPrivateKey>(
      "admin-key"
    );

    if (!adminKeys.length) {
      throw new ItemNotFoundError("Decrypt key not found");
    }

    return adminKeys[0];
  }

  async persistEncryptKey(publicKey: JsonWebKey) {
    if (!this.database) throw new Error("this.database is undefined");
    await this.database.add(
      new Data<JsonWebKey>("encrypt-key", publicKey, __identity)
    );
  }

  async retrieveEncryptKey(): Promise<JsonWebKey> {
    if (!this.database) throw new Error("this.database is undefined");
    const encryptKeys = await this.database.getDataOfType<JsonWebKey>(
      "encrypt-key"
    );

    if (!encryptKeys.length) {
      throw new ItemNotFoundError("Encrypt key not found");
    }

    return encryptKeys[0];
  }

  async persistAnswer(answer: EncryptedAnswer) {
    if (!this.database) throw new Error("this.database is undefined");
    const data = new Data("answer", answer, __identity);
    await this.database.add(data);
  }

  async retrieveAnswers(): Promise<Array<EncryptedAnswer>> {
    if (!this.database) throw new Error("this.database is undefined");
    return await this.database.getDataOfType<EncryptedAnswer>("answer");
  }
}
