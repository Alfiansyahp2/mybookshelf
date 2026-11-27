import { execSync, spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");

const testEnv = {
    ...process.env,
    APP_ENV: "testing",
    DB_DATABASE: process.env.E2E_DB_DATABASE || "testing",
    ...(process.env.E2E_DB_CONNECTION ? { DB_CONNECTION: process.env.E2E_DB_CONNECTION } : {}),
    ...(process.env.E2E_DB_HOST ? { DB_HOST: process.env.E2E_DB_HOST } : {}),
    ...(process.env.E2E_DB_PORT ? { DB_PORT: process.env.E2E_DB_PORT } : {}),
    ...(process.env.E2E_DB_USERNAME ? { DB_USERNAME: process.env.E2E_DB_USERNAME } : {}),
    ...(process.env.E2E_DB_PASSWORD !== undefined
        ? { DB_PASSWORD: process.env.E2E_DB_PASSWORD }
        : {}),
    APP_URL: "http://127.0.0.1:8010",
    FRONTEND_URL: "http://127.0.0.1:4173",
    CORS_ALLOWED_ORIGINS: "http://127.0.0.1:4173,http://localhost:4173",
    SANCTUM_STATEFUL_DOMAINS: "127.0.0.1:4173,localhost:4173",
    CACHE_STORE: "array",
    QUEUE_CONNECTION: "sync",
    SESSION_DRIVER: "file",
    SESSION_DOMAIN: "null",
    SESSION_SECURE_COOKIE: "false",
    SESSION_SAME_SITE: "lax",
    SESSION_HTTP_ONLY: "true",
    SESSION_ENCRYPT: "false",
    MAIL_MAILER: "array",
};

// Isolate PostgreSQL testing database safely and ensure fresh baseline schema + seed data
execSync("php artisan migrate:fresh --force --no-interaction", {
    cwd: repoRoot,
    env: testEnv,
    stdio: "inherit",
});

for (const seeder of [
    "UserSeeder",
    "AchievementSeeder",
    "DefaultExpenseCategorySeeder",
]) {
    execSync(`php artisan db:seed --class=${seeder} --force --no-interaction`, {
        cwd: repoRoot,
        env: testEnv,
        stdio: "inherit",
    });
}

const server = spawn(
    "php",
    ["artisan", "serve", "--host=127.0.0.1", "--port=8010"],
    {
        cwd: repoRoot,
        env: testEnv,
        stdio: "inherit",
    },
);

const shutdown = () => {
    if (!server.killed) {
        server.kill();
    }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("exit", shutdown);

server.on("exit", (code) => {
    process.exit(code ?? 0);
});
