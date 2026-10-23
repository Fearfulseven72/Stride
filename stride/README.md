# Stride

A responsive Next.js / React / TypeScript / Tailwind planner. Earthy colors and compact cards inspired by the supplied references.

## Run locally

Use Node.js 22 or newer. Run `npm install`, then `npm run dev` and open http://127.0.0.1:3000. On Windows, use `npm.cmd` if PowerShell intercepts `npm`.

## Checks

`npm run lint`, `npm run typecheck`, `npm run build`. The static export is generated in `out/`.

## Features and limits

- Add, complete, reopen, filter, and delete tasks with categories, duration, and optional start time.
- Daily schedule displays dated task blocks in time order, with previous/next day navigation and multi-day planning.
- Pomodoro, deep work, and active recall timers with pause and reset. Completed timers contribute to daily focus totals. Keep the tab open; timers do not persist across reloads.
- Daily completed-task recap and auto-saved reflection. Recaps are available on demand, without notifications or background delivery.
- Tasks, session records, and reflections are stored in this browser's localStorage. No accounts, cloud sync, external calendar, or backend integration. Clearing browser data removes records.
- Responsive navigation, semantic controls, native modal focus handling, visible focus styles, reduced-motion support, and Intersection Observer reveal animation.
- The avatar opens a profile page with an editable display name, light/dark/system appearance, and five palettes based on the original color reference. Preferences persist locally under a separate key, preserving task and journal data.
- `/login` provides a themed entry to the real Sites-managed ChatGPT sign-in flow. The platform handles authentication and private access; this static app does not collect passwords, read authenticated identity headers, or sync browser data. Display names are user-entered preferences, not verified account identity. Sign-out uses the platform route and returns to `/login`.
- Daily recap includes a searchable, expandable archive of non-empty journal entries from previous dates, newest first. Today's reflection joins the archive on the following day. Existing `stride-planner-v1` data is preserved.

## Suggested next steps

Add editable tasks, cloud backup and sign-in, user-set break intervals, and opt-in reminders. Audit contrast and keyboard/screen-reader behavior in real browsers before asserting formal WCAG compliance.

## Validation performed

- TypeScript: passed with `tsc --noEmit`.
- ESLint: passed with no errors or warnings across application and configuration files.
- Production: Next.js static export passed, including `/login`; home page first-load JavaScript approximately 116 kB.
- Preview: HTTP 200; desktop layout visually inspected.
- Browser flows: created a dated study task with a start time, verified its schedule block, completed it, verified progress and recap, saved a reflection, and confirmed task/reflection persistence after reload. Tested timer start, pause, and method switching.
- Full-length timer completion and physical mobile/screen-reader testing were not performed.

Journal regression checks: `node --test tests/journal-history.test.mjs` verifies chronological ordering, exclusion of today/empty entries, honest empty state, and safe escaping of journal content.

Profile/login update validation: TypeScript and ESLint passed; all three journal tests passed. Browser testing confirmed avatar navigation, name editing, all five palette controls, light/dark mode, and name/theme/palette persistence after reload. Visually reviewed the profile in dark Storm Grey and login in light Sepia at the browser's 833 px width, and verified the journal archive's placement and empty state. Verified platform sign-in/sign-out destinations; did not interrupt the existing session to run a full authentication round trip. Populated archive ordering and escaping were checked with isolated fixture data, not by modifying production journal records.

On this machine, dependencies were installed in a temporary runtime directory and linked through `node_modules` to avoid conflicts in OneDrive. A clean checkout can use the normal installation instructions above. Temporary install artifacts are ignored by Git, TypeScript, and ESLint.
