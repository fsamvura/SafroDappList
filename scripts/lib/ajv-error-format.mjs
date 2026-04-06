/**
 * @param {import("ajv").ErrorObject} err
 * @returns {string}
 */
export function formatAjvErrorMessage(err) {
  const path = err.instancePath || "/";

  if (err.keyword === "enum" && Array.isArray(err.params?.allowedValues)) {
    const list = err.params.allowedValues.join(", ");
    return `${path} must be one of: ${list}`;
  }

  if (err.keyword === "const" && "allowedValue" in (err.params ?? {})) {
    return `${path} must be ${JSON.stringify(err.params.allowedValue)}`;
  }

  return `${path} ${err.message ?? err.keyword}`;
}
