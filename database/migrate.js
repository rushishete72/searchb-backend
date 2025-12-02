const fs = require("fs");
const path = require("path");
const { db } = require("./db");

async function runMigrations() {
    const migrationDir = path.join(__dirname, "migrations");
    const files = fs.readdirSync(migrationDir).filter(f => f.endsWith(".sql"));

    for (const file of files) {
        const filePath = path.join(migrationDir, file);
        const sql = fs.readFileSync(filePath, "utf8");

        console.log(`Running migration: ${file}`);

        try {
            // pg-promise uses db.none() for executing SQL
            await db.none(sql);

            console.log(`Migration ${file} ✔ OK`);
        } catch (err) {
            console.log(`Migration error in ${file}:`, err.message);
        }
    }
}

module.exports = runMigrations;
