# RiskRadar Demo

RiskRadar is a React + TypeScript demo for monitoring student retention risk at IPTomar. It includes role-aware dashboards, course analysis, a protected student profile flow, and a settings panel that calibrates the demo risk engine.

## What Changed

- Unified route permissions and profile-based access rules.
- Hardened restricted views so financial and socioeconomic data no longer leak through charts, alerts, or narratives.
- Replaced external font and background asset calls with local-safe styling.
- Added CSP and common browser security headers for local preview and static hosting.
- Aligned the settings screen with the actual risk engine inputs.
- Added `test`, `audit`, and `validate` scripts.

## Commands

```bash
npm install
npm run dev
npm run test
npm run lint
npm run build
npm run validate
```

## Security Notes

- The profile switcher is still a demo-only viewing mode. Real security for student data requires backend authentication and server-side authorization.
- Static frontend bundles should never contain real protected student records unless access is enforced on the server before data reaches the browser.
- The static headers in `public/_headers` are provided for hosts that support that convention. Verify production headers at the deployed edge.
