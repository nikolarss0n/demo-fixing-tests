import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const data = fileURLToPath(new URL('../.demo-workspace/', import.meta.url));
console.log(`Demo-only AmbientQA workspace: ${data}`);
const child = spawn('npx', ['-y', '@e2epilot/cli@latest'], {
  cwd: root, env: { ...process.env, E2EPILOT_DATA_DIR: data },
  stdio: 'inherit', shell: process.platform === 'win32',
});
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
