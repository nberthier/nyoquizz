// This is an utils script used for dev purposes.
// Easy way to reset the database by running `bun run scripts/clear.ts`

import { sql } from 'drizzle-orm';

// db.ts
import { db } from '../db';

//reset.ts
async function reset() {
  const tableSchema = db._.schema;
  if (!tableSchema) {
    throw new Error('No table schema found');
  }

  console.log('🗑️  Emptying the entire database');
  const queries = Object.values(tableSchema).map((table) => {
    console.log(`🧨 Preparing delete query for table: ${table.dbName}`);
    return sql.raw(`DROP TABLE ${table.dbName};`);
  });

  console.log('📨 Sending delete queries...');

  await db.transaction(async (tx) => {
    await Promise.all(
      queries.map(async (query) => {
        if (query) await tx.run(query);
      })
    );
  });

  console.log('✅ Database emptied');
}

reset().catch((e) => {
  console.error(e);
});
