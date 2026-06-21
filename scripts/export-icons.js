/**
 * Bulk export icons from Figma using the REST API.
 *
 * Usage: FIGMA_TOKEN=<your-token> node scripts/export-icons.js
 *
 * Exports all icon components from the Fuelight DS file as SVGs
 * into icons/light/ and icons/solid/ directories.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const FILE_KEY = "itYb61KOPXsUQcSJrgl48I";
const TOKEN = process.env.FIGMA_TOKEN;

if (!TOKEN) {
  console.error("Error: Set FIGMA_TOKEN environment variable");
  process.exit(1);
}

const HEADERS = { "X-Figma-Token": TOKEN };

async function fetchJSON(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`);
  return res.json();
}

async function getComponents() {
  const data = await fetchJSON(
    `https://api.figma.com/v1/files/${FILE_KEY}/components`
  );
  return data.meta.components.filter((c) => c.name.startsWith("ic-"));
}

async function exportSVGs(nodeIds) {
  const batches = [];
  for (let i = 0; i < nodeIds.length; i += 100) {
    batches.push(nodeIds.slice(i, i + 100));
  }

  const allUrls = {};
  for (const batch of batches) {
    const ids = batch.join(",");
    const data = await fetchJSON(
      `https://api.figma.com/v1/images/${FILE_KEY}?ids=${ids}&format=svg`
    );
    Object.assign(allUrls, data.images);
    console.log(`  Fetched URLs for ${batch.length} icons...`);
  }
  return allUrls;
}

async function downloadSVG(url, filepath) {
  const res = await fetch(url);
  const svg = await res.text();
  fs.writeFileSync(filepath, svg);
}

async function main() {
  console.log("Fetching component list from Figma...");
  const components = await getComponents();
  console.log(`Found ${components.length} icon components`);

  const outlineDir = path.join(ROOT, "icons", "light");
  const solidDir = path.join(ROOT, "icons", "solid");
  fs.mkdirSync(outlineDir, { recursive: true });
  fs.mkdirSync(solidDir, { recursive: true });

  const outline = components.filter((c) => c.name.endsWith("-outl"));
  const solid = components.filter((c) => !c.name.endsWith("-outl"));

  console.log(`\nExporting ${outline.length} outline icons...`);
  const outlineIds = outline.map((c) => c.node_id);
  const outlineUrls = await exportSVGs(outlineIds);

  for (const comp of outline) {
    const url = outlineUrls[comp.node_id];
    if (url) {
      const name = comp.name.replace(/-outl$/, "") + ".svg";
      await downloadSVG(url, path.join(outlineDir, name));
      process.stdout.write(".");
    }
  }
  console.log(`\n  ✓ ${outline.length} outline icons saved to icons/light/`);

  console.log(`\nExporting ${solid.length} solid icons...`);
  const solidIds = solid.map((c) => c.node_id);
  const solidUrls = await exportSVGs(solidIds);

  for (const comp of solid) {
    const url = solidUrls[comp.node_id];
    if (url) {
      await downloadSVG(url, path.join(solidDir, comp.name + ".svg"));
      process.stdout.write(".");
    }
  }
  console.log(`\n  ✓ ${solid.length} solid icons saved to icons/solid/`);

  console.log("\n✅ Icon export complete!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
