# Security Command Center

Unified owner and management dashboard for DRS and Big 5 operations.

## Features
- Live dashboard for both companies
- Active guard, incident, attendance and patrol compliance metrics
- Panic alert monitoring
- Analytics charts (incident frequency, patrol compliance)
- Export to CSV/PDF
- Integrates with shared Firebase project

## Setup
1. `npm install`
2. Copy `.env.example` to `.env`
3. `npm run dev`

## Deployment
- Build with `npm run build`
- Deploy `dist` on GitHub Pages

## Automation
Use Firebase Cloud Functions + scheduled triggers for daily and weekly reports.
