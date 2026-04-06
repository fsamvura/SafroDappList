import { join } from "node:path";

/** Relative to repo root, for registry consumers. */
export function relativeManifestPath(folderSlug) {
  return `apps/${folderSlug}/json/app.json`;
}

/** Relative to repo root, for registry consumers. */
export function relativeLogoPath(folderSlug) {
  return `apps/${folderSlug}/img/logo.png`;
}

/** @param {string} appsDir absolute path to apps/ */
export function manifestPath(appsDir, folderSlug) {
  return join(appsDir, folderSlug, "json", "app.json");
}

/** @param {string} appsDir absolute path to apps/ */
export function logoPath(appsDir, folderSlug) {
  return join(appsDir, folderSlug, "img", "logo.png");
}

/** @param {string} appsDir */
export function jsonDirPath(appsDir, folderSlug) {
  return join(appsDir, folderSlug, "json");
}

/** @param {string} appsDir */
export function imgDirPath(appsDir, folderSlug) {
  return join(appsDir, folderSlug, "img");
}
