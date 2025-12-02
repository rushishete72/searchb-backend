require("dotenv").config();
const pgp = require("pg-promise")({ capSQL: true });
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// ------------------------------
// SSL CONFIG
// ------------------------------
const sslConfig = process.env.DB_SSL === "true"
  ? { rejectUnauthorized: false, require: true }
  : false;

// ------------------------------
// POSTGRES CONNECTION
// ------------------------------
const cn = {
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
  max: 10,
};

const db = pgp(cn);

// ------------------------------
// 🔥 DROP ALL TABLES (OPTIONAL)
// ------------------------------
async function dropAllTables() {
  console.log("\n⚠ DROPPING ALL TABLES...");

  const dropSQL = `
    DO $$ DECLARE
        r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
    END $$;
  `;

  await db.none(dropSQL);
  console.log("✔ All tables dropped successfully.\n");
}

// ------------------------------
// 📌 RUN MIGRATIONS
// ------------------------------
async function runMigrations() {
  console.log("Running migrations...");

  const migrationsDir = path.join(__dirname, "migrations");
  const files = fs.readdirSync(migrationsDir);

  for (const file of files) {
    if (file.endsWith(".sql")) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");

      try {
        await db.none(sql);
        console.log(`✔ Migration OK: ${file}`);
      } catch (err) {
        console.error(`❌ Migration FAILED in ${file}:`, err.message);
      }
    }
  }
}

// ------------------------------
// 👑 CREATE DEFAULT ADMIN
// ------------------------------
async function ensureAdmin() {
  const email = process.env.DEFAULT_ADMIN_EMAIL || "admin@example.com";
  const password = process.env.DEFAULT_ADMIN_PWD || "admin1234";

  let admin = await db.oneOrNone("SELECT id FROM users WHERE email=$1", [email]);

  const hash = await bcrypt.hash(password, 10);

  if (!admin) {
    await db.none(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)",
      [email, hash, "admin"]
    );
    console.log(`✨ Admin created: ${email}`);
  } else if (process.env.RESET_ADMIN === "true") {
    await db.none(
      "UPDATE users SET password_hash=$1 WHERE email=$2",
      [hash, email]
    );
    console.log(`✨ Admin password RESET: ${email}`);
  }
}

// ------------------------------
// 🚀 INITIALIZE DB
// ------------------------------
async function initializeDB() {
  console.log("Checking DB connection...");

  try {
    const conn = await db.connect();
    conn.done();
    console.log("✅ DB Connected Successfully.\n");

    // RESET DB (Optional)
    if (process.env.RESET_DB === "true") {
      await dropAllTables();
    }

    await runMigrations();
    await ensureAdmin();

  } catch (err) {
    console.error("❌ DB FAILED:", err.message);
  }
}

// EXPORTS
module.exports = {
  db,
  initializeDB
};
