# DRS Security Ops

Production-ready guard operations app for DRS Security Ops. Built as React + Vite PWA and deployable to Android with Capacitor.

## Features
- Google Authentication with role selection (Owner, Management, Admin, Guard)
- Patrol QR scanning with GPS capture and timestamp
- Incident reporting with photo upload to Firebase Storage
- Attendance clock-in/clock-out with Google Sheets export connector
- Panic button with immediate command center alert stream
- Offline-first queue via IndexedDB with automatic sync
- AI assistant module for incident categorization and patrol priority hints

## Free Infrastructure
- Firebase Free Tier (Auth, Firestore, Storage, Functions)
- Google Maps API (free usage limits)
- Google Sheets via Apps Script webhook
- GitHub Actions + GitHub Pages hosting

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and fill Firebase/Google keys.
3. `npm run dev`

## Build & Deploy Web
1. `npm run build`
2. Deploy `dist/` to GitHub Pages.

## Android Build
1. `npm run build`
2. `npm run android:sync`
3. `npm run android:open`
4. Build APK from Android Studio (debug/release).

## Firebase Configuration
- Enable Google Authentication.
- Create Firestore indexes for `attendance`, `patrol_scans`, `incidents`, `panic_alerts`.
- Set Storage rules to allow authenticated upload for company scope.
- Deploy functions in `/functions` for daily reports and attendance forwarding.

## Google Sheets Integration
- Create Apps Script Web App that receives attendance JSON.
- Set `VITE_GOOGLE_SHEETS_WEBHOOK` and use Firebase Function trigger to forward attendance rows.

## Security
- Firestore rules enforce company-level writes.
- Role-based UI route access.
- All data transfer via HTTPS.
- Audit logging through Firestore timestamps + immutable append collections.
