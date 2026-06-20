import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tokensFile = path.join(__dirname, "..", "tokens", "tokens.json");
const tokensDir = path.join(__dirname, "..", "tokens");
const data = JSON.parse(fs.readFileSync(tokensFile, "utf-8"));

const sets = data.$metadata?.tokenSetOrder || [];

for (const setName of sets) {
  if (data[setName]) {
    const outputPath = path.join(tokensDir, `${setName}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(data[setName], null, 2));
    console.log(`  ✓ tokens/${setName}.json`);
  }
}

console.log(`\n✅ Split ${sets.length} token sets from tokens.json`);
