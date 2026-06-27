/**
 * One-shot migration: copy all collections from OLD_MONGODB_URI to
 * NEW_MONGODB_URI, EXCLUDING the bookings collection (which contained
 * data from a previous unrelated project).
 *
 * Usage:
 *   $env:OLD_MONGODB_URI="mongodb+srv://..."
 *   $env:NEW_MONGODB_URI="mongodb+srv://.../boracays_sands_resort?..."
 *   node scripts/migrateToNewCluster.js
 */

const mongoose = require("mongoose");

const EXCLUDE = new Set([
  "bookings",
  // never copy system collections
  "system.indexes",
  "system.users",
  "system.version",
]);

async function run() {
  const OLD = process.env.OLD_MONGODB_URI;
  const NEW = process.env.NEW_MONGODB_URI;
  if (!OLD || !NEW) {
    throw new Error("Set OLD_MONGODB_URI and NEW_MONGODB_URI env vars");
  }

  const oldConn = await mongoose
    .createConnection(OLD)
    .asPromise();
  const newConn = await mongoose
    .createConnection(NEW)
    .asPromise();

  console.log(`OLD â†’ ${oldConn.host}/${oldConn.db.databaseName}`);
  console.log(`NEW â†’ ${newConn.host}/${newConn.db.databaseName}`);

  const collections = await oldConn.db.listCollections().toArray();
  let totalDocs = 0;
  let skipped = 0;

  for (const { name } of collections) {
    if (EXCLUDE.has(name)) {
      console.log(`  âŠ˜ skipped ${name} (excluded)`);
      skipped += 1;
      continue;
    }

    const docs = await oldConn.db.collection(name).find({}).toArray();
    if (!docs.length) {
      console.log(`  Â· ${name}: empty`);
      continue;
    }

    // Wipe destination collection before insert so we never get duplicates
    try {
      await newConn.db.collection(name).deleteMany({});
    } catch (_e) {
      /* collection may not exist yet */
    }

    await newConn.db.collection(name).insertMany(docs, { ordered: false });
    console.log(`  âœ“ ${name}: ${docs.length} docs copied`);
    totalDocs += docs.length;
  }

  // Copy indexes for collections we migrated (so unique constraints survive)
  for (const { name } of collections) {
    if (EXCLUDE.has(name)) continue;
    try {
      const indexes = await oldConn.db.collection(name).indexes();
      for (const idx of indexes) {
        if (idx.name === "_id_") continue;
        const { key, name: idxName, ...options } = idx;
        try {
          await newConn.db
            .collection(name)
            .createIndex(key, { name: idxName, ...options });
        } catch (e) {
          // index may already exist or be incompatible â€” non-fatal
        }
      }
    } catch (_e) {
      /* ignore */
    }
  }

  console.log("â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€");
  console.log(` Total docs copied : ${totalDocs}`);
  console.log(` Collections skipped: ${skipped}`);
  console.log("â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€");

  await oldConn.close();
  await newConn.close();
}

run().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
