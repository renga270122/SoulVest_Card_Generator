const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const inputIcon = path.join(root, 'icon-512.png');
const assetsDir = path.join(root, 'assets');

async function ensureDir(dirPath) {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

async function createSolidBackground(filePath, size, hexColor) {
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: hexColor,
    },
  })
    .png()
    .toFile(filePath);
}

async function createSplash(filePath, size, bgColor, iconSize) {
  const iconBuffer = await sharp(inputIcon)
    .resize(iconSize, iconSize, { fit: 'contain' })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bgColor,
    },
  })
    .composite([{ input: iconBuffer, gravity: 'center' }])
    .png()
    .toFile(filePath);
}

async function main() {
  if (!fs.existsSync(inputIcon)) {
    throw new Error(`Missing source icon: ${inputIcon}`);
  }

  await ensureDir(assetsDir);

  const iconOnlyPath = path.join(assetsDir, 'icon-only.png');
  const iconForegroundPath = path.join(assetsDir, 'icon-foreground.png');
  const iconBackgroundPath = path.join(assetsDir, 'icon-background.png');
  const splashPath = path.join(assetsDir, 'splash.png');
  const splashDarkPath = path.join(assetsDir, 'splash-dark.png');

  await sharp(inputIcon).resize(1024, 1024, { fit: 'contain' }).png().toFile(iconOnlyPath);
  await sharp(inputIcon).resize(1024, 1024, { fit: 'contain' }).png().toFile(iconForegroundPath);
  await createSolidBackground(iconBackgroundPath, 1024, '#764ba2');

  await createSplash(splashPath, 2732, '#f8f5ff', 860);
  await createSplash(splashDarkPath, 2732, '#1f1a2d', 860);

  console.log('Prepared Capacitor asset source files in assets/');
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
