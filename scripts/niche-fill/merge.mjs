import fs from 'fs';
import path from 'path';
import { scenarios, labels, promotions, patterns } from './data.mjs';

const ROOT = process.cwd();
const NICHES = ['accounting', 'construction', 'law_firm', 'cleaning_service'];

function mergeJsonFile(relPath, newData) {
  const fullPath = path.join(ROOT, relPath);
  const current = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  for (const niche of NICHES) {
    current[niche] = newData[niche];
  }
  fs.writeFileSync(fullPath, JSON.stringify(current, null, 2) + '\n', 'utf8');
  console.log(`[merged] ${relPath} <- ${NICHES.join(', ')}`);
}

mergeJsonFile('src/lib/niche-scenarios.json', scenarios);
mergeJsonFile('src/lib/niche-labels.json', labels);
mergeJsonFile('src/lib/niche-promotions.json', promotions);

for (const niche of NICHES) {
  const dir = path.join(ROOT, 'patterns', niche);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'pattern.json');
  fs.writeFileSync(file, JSON.stringify(patterns[niche], null, 2) + '\n', 'utf8');
  console.log(`[created] patterns/${niche}/pattern.json`);
}

console.log('\nDone. 4 niches added: ' + NICHES.join(', '));
