import { cpSync, existsSync, mkdirSync, renameSync, writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const healthy = process.argv.includes('--healthy');
const archive = join(root, '.demo-archive', `reset-${new Date().toISOString().replaceAll(':', '-')}`);
const baseline = join(root, 'scripts', 'baseline');
// This reset is scoped to disposable demo files, never Git or the user's global workspace.
const restore = ['pages', 'test', 'playwright.config.js', '.e2e-workflows.json'];
const generated = ['.e2e-flows.json', '.pw-test-writer', '.wdio-test-writer', 'test-results', 'test-reports', 'playwright-report', '.demo-workspace'];
mkdirSync(archive, { recursive: true });
for (const relative of [...restore, ...generated]) {
  const source = join(root, relative);
  if (existsSync(source)) renameSync(source, join(archive, relative));
}
for (const relative of restore) cpSync(join(baseline, relative), join(root, relative), { recursive: true });
if (healthy) {
  for (const page of ['BankPage', 'HomePage']) {
    writeFileSync(join(root, 'pages', `${page}.js`), readFileSync(join(root, 'scripts', `${page}.healthy.txt`)));
  }
}
try {
  const response = await fetch('http://127.0.0.1:4174/api/bank/reset', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario: 'baseline' }), signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  console.log('Running banking app reset to baseline.');
} catch (error) {
  console.log(`App reset unavailable (${error.message}); each test resets the app before running.`);
}
console.log(healthy ? 'Healthy selectors restored: expect 5 passing tests.' : 'Demo starting state restored: expect 5 failing tests from 2 stale selectors.');
console.log(`Previous demo files and isolated UI state archived at ${archive}`);
