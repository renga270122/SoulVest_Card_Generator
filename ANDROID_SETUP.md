# Android App Setup (Capacitor)

This project can run as a native Android app using Capacitor.

## 1) Prerequisites

- Node.js 18+
- Android Studio (latest stable)
- Java 17 (recommended for modern Android builds)

## 2) Install dependencies

```bash
npm install
```

## 3) Generate Android project

```bash
npm run android:init
```

This creates the `android/` folder and syncs your web files.

The scripts automatically stage your site files into `web/` before syncing.

## 4) Open in Android Studio

```bash
npm run cap:open:android
```

## 5) Build APK/AAB

From Android Studio:

- **APK (testing):** Build > Build Bundle(s) / APK(s) > Build APK(s)
- **AAB (Play Store):** Build > Generate Signed Bundle / APK > Android App Bundle

## 6) When web files change

Run:

```bash
npm run cap:sync
```

Then rebuild from Android Studio.

## 7) Update Android icon and splash

Whenever branding changes, run:

```bash
npm run android:assets
```

This regenerates Android launcher icons and splash screens from files in `assets/`.

## Notes

- `webDir` is `web/` (generated automatically by `npm run prepare:web`).
- Keep SEO files (`robots.txt`, `sitemap.xml`) for web; they don’t affect Android runtime.
- App ID is currently `com.soulvest.cardgenerator`. Change it before store release if needed.
