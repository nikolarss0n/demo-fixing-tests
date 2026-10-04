# AmbientQA / E2Epilot repeatable fixing demo

Five Playwright tests against a fictional local banking app. The starting state has two intentionally stale selectors in shared page objects:

- Cards: three tests fail because `freeze-card-old` should be `card-freeze-button` in `pages/BankPage.js`.
- Home balances: two tests fail because `screen-home-old` should be `screen-home` in `pages/HomePage.js`.

The app uses synthetic data and demo PIN `2468`. No real bank, account, database, or banking credentials are involved. The suite uses desktop Chromium at 1440 × 900, one worker, and zero retries.

## 1. Install prerequisites

Install Node.js 22.13 or newer (Node 24 LTS recommended) and Git. Open Terminal on macOS/Linux or PowerShell on Windows and check:

```sh
node --version
npm --version
git --version
```

## 2. Check the CLI first

Run:

```sh
npx -y @e2epilot/cli@latest
```

This downloads and runs the latest published CLI; it does not install a global `e2epilot` command. Keep the terminal open while using the browser. It opens the AmbientQA interface at the localhost URL printed in the terminal, usually `http://localhost:4000`; occupied ports cause it to choose the next port. The first download can take a little while.

Confirm the interface opens, then stop it with Ctrl+C before the next step. If the browser does not open automatically, paste the printed URL into your browser. A bare `e2epilot` command may run an older global installation; use `npx` for this demo.

## 3. Clone both public repositories

From the directory where you keep demo projects:

```sh
git clone https://github.com/nikolarss0n/demo-bank-app.git
git clone https://github.com/nikolarss0n/demo-fixing-tests.git demo_fixing
```

Keep `demo-bank-app` and `demo_fixing` next to each other. The Playwright configuration relies on that sibling directory name.

Install the banking app:

```sh
cd demo-bank-app
npm ci
cd ../demo_fixing
npm ci
npx playwright install chromium
```

On Linux, if browser system dependencies are missing, use `npx playwright install --with-deps chromium` (may require administrator permissions).

## 4. Prepare the failing starting state

Inside `demo_fixing`:

```sh
npm run demo:reset
npm test
```

The reset restores the original five tests, page objects, desktop configuration, and workflow catalog. `npm test` automatically starts the sibling banking app on port 4174 if it is not already running. Expect **5 failed tests**, caused by the two deliberately stale selectors; the nonzero exit status is intentional. Failures connecting to the server or signing into the banking fixture are setup problems, not the intended demo failures.

## 5. Start the banking app for the live demo

Open another terminal:

```sh
cd demo-bank-app
npm run dev -- --hostname 127.0.0.1 --port 4174
```

Leave it running. Open `http://127.0.0.1:4174` to inspect the app; sign in with PIN `2468`. If port 4174 is already occupied, stop the other process or confirm it is this demo app.

## 6. Open AmbientQA with a fresh demo workspace

In the terminal inside `demo_fixing`:

```sh
npm run demo:ui
```

This runs **`npx -y @e2epilot/cli@latest`** with `E2EPILOT_DATA_DIR` pointing to this clone's `.demo-workspace` directory. It works on macOS, Linux, and Windows. Using this wrapper isolates the demo's account session, reports, learned repairs, and saved cases from your normal AmbientQA workspace.

To invoke the same command directly on macOS/Linux:

```sh
E2EPILOT_DATA_DIR="$PWD/.demo-workspace" npx -y @e2epilot/cli@latest
```

Or in Windows PowerShell:

```powershell
$env:E2EPILOT_DATA_DIR = Join-Path (Get-Location) '.demo-workspace'
npx -y @e2epilot/cli@latest
```

Follow the CLI's sign-in/account flow with your own AmbientQA account. Account access or usage limits can block agent tasks even when the local page loads.

In the browser:

1. Use **Project setup** to connect the local `demo_fixing` directory if it is not selected automatically. Confirm the selected path is this clone, rather than a previous project.
2. Open **Test scenarios** and wait for all five tests to appear.
3. Run all five tests to show the starting failures.
4. Use **Inspect**, then **Fix**, or submit: “Fix the two stale page-object selectors causing these five tests to fail. Preserve all assertions and run the full suite to verify.”
5. Inspect the changed page objects and the final full-suite report. The completion criterion is **5 passed**, not just a success message from the agent.
6. Independently run `npm test` in this repository to confirm all five pass.

Do not use `demo:healthy` during the live fixing demonstration: that command applies the known selector repairs directly, bypassing the agent.

## 7. Repeat the demo from the beginning

Stop AmbientQA with Ctrl+C first. Do not reset while a test run or agent task is active. Then, inside `demo_fixing`:

```sh
npm run demo:reset
npm run demo:ui
```

The banking app can stay running; reset requests its baseline state, and every test also resets its own state before execution. Reload the new localhost page and reconnect the project. A fresh isolated workspace requires signing in again.

The reset archives all prior `pages/`, `test/`, demo configuration, workflow catalog, generated reports/flows, writer artifacts, and `.demo-workspace` beneath `.demo-archive/reset-<timestamp>/`. It then restores the checked-in baseline, including both intentional selector defects. Extra tests and changes from previous demos are removed from the active suite but retained in that archive. It does not touch `.git`, dependencies, the sibling app's source, or `~/.e2epilot`. Treat this clone as disposable demo work; keep useful custom work elsewhere. Archives can contain session data, so keep them private; Git ignores them.

## Optional: verify the healthy fixture without the agent

```sh
npm run demo:healthy
npm test
npm run demo:reset
```

Expected results: healthy mode **5 passed**; the final reset returns to the **5-failure** starting state. `demo:healthy` performs the same archive/reset as `demo:reset` and then restores both correct selectors.

## Updating an existing clone

Stop the CLI. Archive your demo changes with `npm run demo:reset`, then pull updates only after checking `git status` and preserving any work you want to keep. A reset deliberately creates stale selectors and may therefore leave page-object changes against a previously healthy checkout. On the published baseline the stale selectors are already committed.

For a guaranteed clean updated demo, clone into a new sibling directory beside `demo-bank-app`, install dependencies, and run the setup again. Avoid `git reset --hard` when you have work to keep.
