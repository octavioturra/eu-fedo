import Database from "./database";
declare global {
  interface Window {
    _db: any;
  }
}
let _db: any = null;
window._db = _db;
export default async function(pollId: string, filesystem: any) {
  if (!_db) {
    _db = new Database(filesystem).retrieve(pollId);
  }
  window._db = _db;
  // const db = await _db;
  // await db.db.syncLocal();
  return _db;
}
