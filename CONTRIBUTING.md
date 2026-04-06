# Contributing to SafrodAppList

Thank you for helping grow the Safrod community dApp directory.

## License

This repository is licensed under the [MIT License](LICENSE). By opening a pull request or otherwise contributing listing data or code, you agree that your contributions are licensed under the same terms unless you state otherwise.

Listing metadata you submit (for example `app.json` text and logos) should be material you have the right to share. Do not submit third-party trademarks or assets without permission.

## Before you open a pull request (required)

Do these steps **first** on your machine. Pull requests should only be opened after local validation succeeds.

1. **Use Node.js 20 or newer** (see `package.json` `engines`).

2. **Install dependencies**

   ```bash
   npm ci
   ```

3. **Run the full validator** (this is the same check CI runs)

   ```bash
   npm run validate
   ```

   This verifies, for every app under `apps/`:

   - `apps/<slug>/json/app.json` exists and matches [schemas/app.manifest.schema.json](schemas/app.manifest.schema.json)
   - `slug` equals the folder name `<slug>`
   - Folder name is **2–64 characters**, **lowercase letters and digits only** (no spaces, hyphens, or symbols)
   - `apps/<slug>/img/logo.png` exists, is **PNG**, and is **exactly 512×512** pixels
   - No duplicate `slug` values across manifests
   - [registry.json](registry.json) is **in sync** with all manifests (see next step)

4. **Regenerate the registry** after adding or changing an app

   ```bash
   npm run build:registry
   ```

5. **Commit the updated `registry.json`** in the **same pull request** as your new or changed `apps/<slug>/` folder.

If `npm run validate` fails, fix the reported paths and messages, then run it again until it passes.

## Adding or updating a dApp listing

1. Create a **new folder** under `apps/` named exactly like your manifest `slug` (alphanumeric, lowercase).

2. Add:

   - `apps/<slug>/json/app.json` — manifest; use `"$schema": "../../../schemas/app.manifest.schema.json"` for editor hints
   - `apps/<slug>/img/logo.png` — square **512×512** PNG

3. Allowed **category** values are fixed in the schema. List them anytime:

   ```bash
   npm run listcategories
   ```

   For **status**, **chains**, and categories together:

   ```bash
   npm run listenums
   ```

4. Run `npm run build:registry` and commit `registry.json`.

## Maintainer-only changes

New listing **categories** (themes) are added by editing the enum in [schemas/app.manifest.schema.json](schemas/app.manifest.schema.json) and, when needed, bumping `schemaVersion` and migrating entries.

## Questions and problems

- Use [GitHub Issues](https://github.com/SAFROCHAIN/SafrodAppList/issues) with the appropriate template.
- For CI or validation failures, paste the **full output** of `npm run validate` in your issue or PR description.
