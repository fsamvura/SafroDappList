/**
 * Recursively sort object keys for deterministic JSON output.
 * @param {unknown} value
 * @returns {unknown}
 */
export function sortKeysDeep(value) {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value !== null && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortKeysDeep(value[key]);
        return acc;
      }, {});
  }
  return value;
}

/**
 * @param {unknown} obj
 * @returns {string}
 */
export function stableStringify(obj) {
  return `${JSON.stringify(sortKeysDeep(obj), null, 2)}\n`;
}
