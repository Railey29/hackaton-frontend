import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

export function getMongoDbName() {
  // If the URI doesn't specify a database, Atlas defaults to "test".
  return process.env.MONGODB_DB || "frontend_health";
}

export async function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI");
  }

  // Lazy-connect so `next build` doesn't try to reach MongoDB.
  if (process.env.NODE_ENV === "development") {
    if (!global.__mongoClientPromise) {
      const client = new MongoClient(uri);
      global.__mongoClientPromise = client.connect();
    }
    return global.__mongoClientPromise;
  }

  if (!global.__mongoClientPromise) {
    const client = new MongoClient(uri);
    global.__mongoClientPromise = client.connect();
  }
  return global.__mongoClientPromise;
}
