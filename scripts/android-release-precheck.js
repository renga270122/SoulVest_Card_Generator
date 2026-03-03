const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const androidDir = path.join(root, 'android');
const keystoreProps = path.join(androidDir, 'keystore.properties');
const buildGradle = path.join(androidDir, 'app', 'build.gradle');

function fail(message) {
  console.error(`\n[release precheck] ${message}`);
  process.exit(1);
}

if (!fs.existsSync(androidDir)) {
  fail('Android project not found. Run: npm run android:init');
}

if (!fs.existsSync(keystoreProps)) {
  fail('Missing android/keystore.properties. Copy android/keystore.properties.example and fill values.');
}

const keystoreText = fs.readFileSync(keystoreProps, 'utf8');
const requiredKeys = ['storeFile=', 'storePassword=', 'keyAlias=', 'keyPassword='];
for (const key of requiredKeys) {
  if (!keystoreText.includes(key)) {
    fail(`keystore.properties is missing ${key}`);
  }
}

const gradleText = fs.readFileSync(buildGradle, 'utf8');
if (!gradleText.includes('versionCode') || !gradleText.includes('versionName')) {
  fail('android/app/build.gradle is missing versionCode/versionName');
}

console.log('[release precheck] OK: Signing config and version fields are present.');
