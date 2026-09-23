import { readFileSync, writeFileSync } from 'node:fs';
const healthy = process.argv.includes('--healthy');
for (const [page, selector] of [['BankPage', 'freeze-card'], ['HomePage', 'screen-home']]) {
  const source = readFileSync(new URL(`./${page}.healthy.txt`, import.meta.url), 'utf8');
  writeFileSync(new URL(`../pages/${page}.js`, import.meta.url), healthy ? source : source.replace(`'${selector}'`, `'${selector}-old'`));
}
