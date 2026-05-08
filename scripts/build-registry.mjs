import {
  readdirSync,
  readFileSync,
  writeFileSync,
  statSync,
  existsSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { stableStringify } from "./lib/stable-json.mjs";
import {
  manifestPath,
  relativeManifestPath,
  relativeLogoPath,
  jsonDirPath,
  imgDirPath,
} from "./lib/app-paths.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const APPS_DIR = join(ROOT, "apps");
const FEATURED_PATH = join(ROOT, "featured.json");

const REGISTRY_VERSION = 1;
const EMPTY_GENERATED_AT = "1970-01-01";

/**
 * @returns {string[]}
 */
function loadFeaturedSlugs() {
  try {
    if (!existsSync(FEATURED_PATH)) return [];
    const raw = readFileSync(FEATURED_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.slugs)) {
      return parsed.slugs;
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * @returns {string[]}
 */
function listAppSlugs() {
  let names;
  try {
    names = readdirSync(APPS_DIR);
  } catch {
    return [];
  }
  return names.filter((name) => {
    if (name.startsWith(".")) return false;
    const p = join(APPS_DIR, name);
    try {
      return statSync(p).isDirectory();
    } catch {
      return false;
    }
  });
}

/**
 * @returns {{ registryVersion: number, generatedAt: string, apps: object[] }}
 */
export function buildRegistryObject() {
  const slugs = listAppSlugs().sort();
  /** @type {object[]} */
  const apps = [];
  let maxUpdated = "";

  for (const folderSlug of slugs) {
    const jsonDir = jsonDirPath(APPS_DIR, folderSlug);
    const imgDir = imgDirPath(APPS_DIR, folderSlug);
    if (!existsSync(jsonDir) || !statSync(jsonDir).isDirectory()) {
      throw new Error(`apps/${folderSlug}: missing json/ directory`);
    }
    if (!existsSync(imgDir) || !statSync(imgDir).isDirectory()) {
      throw new Error(`apps/${folderSlug}: missing img/ directory`);
    }

    const manifestFile = manifestPath(APPS_DIR, folderSlug);
    if (!existsSync(manifestFile)) {
      throw new Error(`apps/${folderSlug}/json/app.json: missing`);
    }
    let raw;
    try {
      raw = readFileSync(manifestFile, "utf8");
    } catch (e) {
      throw new Error(`apps/${folderSlug}/json/app.json: could not read (${e.message})`);
    }
    let manifest;
    try {
      manifest = JSON.parse(raw);
    } catch (e) {
      throw new Error(`apps/${folderSlug}/json/app.json: invalid JSON (${e.message})`);
    }
    if (!manifest || typeof manifest !== "object") {
      throw new Error(`apps/${folderSlug}/json/app.json: root must be a JSON object`);
    }

    const entry = {
      ...manifest,
      manifestPath: relativeManifestPath(folderSlug),
      logoPath: relativeLogoPath(folderSlug),
    };
    apps.push(entry);

    const u = manifest.updatedAt;
    if (typeof u === "string" && u > maxUpdated) maxUpdated = u;
  }

  const generatedAt = maxUpdated || EMPTY_GENERATED_AT;
  const featuredSlugs = loadFeaturedSlugs();

  const result = {
    registryVersion: REGISTRY_VERSION,
    generatedAt,
    apps,
  };

  if (featuredSlugs.length > 0) {
    result.featuredSlugs = featuredSlugs;
  }

  return result;
}

export function buildRegistryString() {
  return stableStringify(buildRegistryObject());
}

const isMain =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  const outPath = join(ROOT, "registry.json");
  writeFileSync(outPath, buildRegistryString(), "utf8");
  console.error(`Wrote ${outPath}`);
}
