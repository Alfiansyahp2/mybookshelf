import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: false,
    workers: 1,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
    use: {
        baseURL: "http://127.0.0.1:4173",
        trace: "on-first-retry",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    webServer: [
        {
            command: "node scripts/e2e-backend.mjs",
            url: "http://127.0.0.1:8010/api/health",
            reuseExistingServer: false,
            timeout: 60_000,
        },
        {
            command: "npx vite --host 127.0.0.1 --port 4173 --strictPort",
            url: "http://127.0.0.1:4173",
            reuseExistingServer: false,
            timeout: 60_000,
            env: {
                VITE_API_URL: "http://127.0.0.1:8010/api",
            },
        },
    ],
});
