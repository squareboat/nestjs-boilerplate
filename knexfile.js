// Used by the knex CLI, e.g. `npx knex seed:run`.
// Migrations run through the app instead: `node cli migrate`.
// Reads the same DB_* variables as config/database.ts.
try {
  process.loadEnvFile();
} catch {
  // no .env file, use the environment as it is
}

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    migrations: {
      directory: './database/migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
};
