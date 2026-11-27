import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, "../dist/assets");

if (!fs.existsSync(assetsDir)) {
    console.error(`Bundle directory not found: ${assetsDir}`);
    process.exit(1);
}

const BUDGETS = [
    { prefix: "index-", ext: ".js", maxGzipKb: 85, label: "Main entry JS" },
    { prefix: "index-", ext: ".css", maxGzipKb: 30, label: "Main CSS" },
    { prefix: "vendor-react-", ext: ".js", maxGzipKb: 85, label: "Vendor React" },
    { prefix: "vendor-charts-", ext: ".js", maxGzipKb: 125, label: "Vendor Charts" },
];

const files = fs.readdirSync(assetsDir);
let failed = false;

console.log("Bundle Size Budget Report:");
for (const budget of BUDGETS) {
    const match = files.find(
        (name) => name.startsWith(budget.prefix) && name.endsWith(budget.ext),
    );
    if (!match) {
        console.warn(`- [SKIP] ${budget.label}: no file matching ${budget.prefix}*${budget.ext}`);
        continue;
    }

    const raw = fs.readFileSync(path.join(assetsDir, match));
    const gzipKb = Number((zlib.gzipSync(raw).length / 1024).toFixed(2));
    const withinBudget = gzipKb <= budget.maxGzipKb;
    const status = withinBudget ? "PASS" : "FAIL";

    console.log(
        `- [${status}] ${budget.label} (${match}): ${gzipKb} kB gzip / ${budget.maxGzipKb} kB max`,
    );

    if (!withinBudget) {
        failed = true;
    }
}

if (failed) {
    console.error("Bundle size budget exceeded.");
    process.exit(1);
}
