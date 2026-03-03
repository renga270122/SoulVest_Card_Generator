# Android Release Checklist (Play Store)

## 1) Create signing key (one-time)

From project root:

```bash
keytool -genkeypair -v -keystore keystore/soulvest-release-key.jks -alias soulvest -keyalg RSA -keysize 2048 -validity 10000
```

Create folder first if needed:

```bash
mkdir keystore
```

## 2) Configure signing

1. Copy `android/keystore.properties.example` to `android/keystore.properties`
2. Fill `storeFile`, `storePassword`, `keyAlias`, `keyPassword`

## 3) Versioning

Edit `android/app/build.gradle`:

- `versionCode` -> increment every release
- `versionName` -> user-facing version (e.g. `1.0.1`)

## 4) Build release AAB

One-command from terminal:

```bash
npm run android:build:aab
```

Or in Android Studio:

- Build > Generate Signed Bundle / APK
- Choose **Android App Bundle**
- Use your keystore
- Build release

## 5) Before upload

- App name/icon/splash verified
- Privacy policy URL ready (`https://renga270122.github.io/SoulVest_Card_Generator/privacy-policy.html`)
- Screenshots + feature graphic ready
- Content rating + target audience completed
- Internal testing track first

## Build Commands

- Debug APK: `npm run android:build:debug`
- Release APK: `npm run android:build:apk`
- Release AAB: `npm run android:build:aab`

## 6) Keep safe

- Backup your `.jks` keystore and passwords securely
- Losing release key can block future updates
