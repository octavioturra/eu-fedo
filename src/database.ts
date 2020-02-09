declare global {
  interface Window {
    OrbitDB: any;
  }
}

export class Data<T> {
  constructor(
    public __type: string,
    public content: T,
    public __identity: string
  ) {}
}

export default class Database {
  db: any;
  constructor(private ipfs: any) {}
  async retrieve(identity: String): Promise<Database> {
    const orbitdb = await window.OrbitDB.createInstance(this.ipfs);
    this.db = await orbitdb.feed(identity, {
      // If database doesn't exist, create it
      create: true,
      overwrite: true,
      // Load only the local version of the database,
      // don't load the latest from the network yet
      localOnly: false,
      syncLocal: true,
      // If "Public" flag is set, allow anyone to write to the database,
      // otherwise only the creator of the database can write
      accessController: {
        write: ["*"]
      }
    });
    await this.db.load();
    return this;
  }
  async add<T>(data: Data<T>): Promise<Database> {
    console.log(data, "add");
    await this.db.add(JSON.stringify(data));
    return this;
  }
  async getDataOfType<T>(type: string): Promise<Array<T>> {
    const data = this.db.iterator({ limit: 500 }).collect();
    console.log(data, "getDataOfType", type);
    return data
      .map((d: any) => JSON.parse(d.payload.value))
      .filter((d: Data<T>) => d.__type === type)
      .map((d: Data<T>) => d.content);
  }
  async getDataOfIdentity<T>(identity: string): Promise<Array<T>> {
    const data = this.db.iterator({ limit: 500 }).collect();
    console.log(data, "getDataOfType", identity);
    return data
      .map((d: any) => JSON.parse(d.payload.value))
      .filter((d: Data<T>) => d.__identity === identity)
      .map((d: Data<T>) => d.content);
  }
}
