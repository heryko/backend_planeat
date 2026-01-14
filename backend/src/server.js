require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 3000;
const db = require('./db/connection');

const { swaggerDocs } = require("./swagger");
swaggerDocs(app, PORT);

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err && err.stack ? err.stack : err);
});

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

const server = app.listen(PORT, '0.0.0.0', () => {
  const addr = server.address();
  console.log(`Serwer uruchomiony na porcie ${addr.port} (host ${addr.address})`);
  console.log(`📄 Swagger UI dostępny pod: http://localhost:${addr.port}/api-docs`);
});

async function ensureShoppingListNameColumn() {
  try {
    const databaseName = process.env.DB_NAME || 'plan_eat';
    const pool = db.promise();
    const [rows] = await pool.query(
      'SELECT 1 AS ok FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ? LIMIT 1',
      [databaseName, 'shopping_lists', 'name']
    );
    if (Array.isArray(rows) && rows.length > 0) return;

    await pool.query('ALTER TABLE shopping_lists ADD COLUMN name VARCHAR(100) NULL AFTER plan_id');
    console.log('✅ DB migration: added shopping_lists.name');
  } catch (err) {
    // Don't crash server if migration can't run (e.g. no privileges)
    console.warn('⚠️ DB migration skipped (shopping_lists.name):', err && err.message ? err.message : err);
  }
}

ensureShoppingListNameColumn();

// Keep process alive for environments where the event loop might be empty
setInterval(() => {}, 1 << 30);


