import { MongoMemoryServer } from "mongodb-memory-server";
async function run() {
  try {
    const s = await MongoMemoryServer.create();
    console.log(s.getUri());
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
