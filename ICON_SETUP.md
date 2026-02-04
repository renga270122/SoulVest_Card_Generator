# PWA Icon Generation

You need to create PNG icons from the icon.svg file. Here are 3 easy ways:

## Option 1: Online Converter (Easiest)
1. Go to: https://svgtopng.com/ or https://cloudconvert.com/svg-to-png
2. Upload `icon.svg`
3. Convert to PNG at:
   - 192x192 pixels (save as `icon-192.png`)
   - 512x512 pixels (save as `icon-512.png`)
4. Place both PNG files in the root folder

## Option 2: Use Canva (Recommended)
1. Go to https://canva.com
2. Create 192x192 design
3. Add gradient background (purple to pink)
4. Add card icon and heart emoji
5. Download as PNG (icon-192.png)
6. Repeat for 512x512 (icon-512.png)

## Option 3: Use Built-in Tool (Windows)
1. Open `icon.svg` in browser
2. Right-click → "Save Image As" → PNG
3. Use image editor to resize to 192x192 and 512x512

## Quick Icon Generator Script
If you have Node.js installed, you can use this command:
```bash
npx sharp-cli resize 192 192 icon.svg -o icon-192.png
npx sharp-cli resize 512 512 icon.svg -o icon-512.png
```

After creating the icons, the PWA will work perfectly!
