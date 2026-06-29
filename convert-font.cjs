const ttf2woff = require('ttf2woff');
const fs = require('fs');
const path = require('path');

const FONTS_DIR = path.join(process.cwd(), 'public/fonts');

const files = ['NotoSansSC-Regular.ttf', 'NotoSansSC-Bold.ttf'];
for (const file of files) {
  const src = path.join(FONTS_DIR, file);
  const dst = src.replace('.ttf', '.woff');
  const ttf = fs.readFileSync(src);
  const woff = ttf2woff(ttf);
  fs.writeFileSync(dst, Buffer.from(woff));
  const orig = fs.statSync(src).size;
  const woffSize = fs.statSync(dst).size;
  console.log(`${file}: TTF ${(orig/1024/1024).toFixed(1)}MB -> WOFF ${(woffSize/1024/1024).toFixed(1)}MB`);
}
console.log('Done!');
