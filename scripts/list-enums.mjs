import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = join(__dirname, "..", "schemas", "app.manifest.schema.json");

const schema = JSON.parse(readFileSync(SCHEMA_PATH, "utf8"));

const categories = schema.$defs?.categoryTheme?.enum ?? [];
const status = schema.properties?.status?.enum ?? [];
const chains = schema.properties?.chains?.items?.enum ?? [];

const arg = (process.argv[2] ?? "all").toLowerCase();

function printCategories() {
  for (const c of categories) console.log(c);
}

function printAll() {
  console.log('Field "category" (single predefined theme):');
  console.log(categories.join(", "));
  console.log("");
  console.log('Field "status" (état du projet):');
  console.log(status.join(", "));
  console.log("");
  console.log('Each item in "chains" array:');
  console.log(chains.join(", "));
  console.log("");
  console.log("Tip: npm run listcategories — one category id per line.");
}

if (arg === "categories" || arg === "category" || arg === "listcategories") {
  printCategories();
} else if (arg === "status") {
  for (const s of status) console.log(s);
} else if (arg === "chains" || arg === "chain") {
  for (const c of chains) console.log(c);
} else if (arg === "all" || arg === "--all") {
  printAll();
} else {
  console.error(`Unknown target "${process.argv[2]}". Use: all | categories | status | chains`);
  process.exit(1);
}
