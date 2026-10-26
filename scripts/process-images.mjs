// Builds the site's image set from the master files in design/source-images.
// Each output is a named crop, written as a high-quality JPEG into src/assets/images so that
// next/image can import it statically (width, height and blur placeholder come for free).
//
//   npm run images
//
// To replace a picture with real photography, drop the new master into design/source-images
// under the same name (or edit the crop table below) and re-run the script.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const SRC = "design/source-images";
const OUT = "src/assets/images";
mkdirSync(OUT, { recursive: true });

// [output name, source file, crop {left, top, width, height} in source pixels | null for full frame]
const crops = [
  // Campaign and editorial
  ["hero-desktop", "hero-desktop", null],
  ["hero-mobile", "hero-mobile", null],
  ["campaign-emerald", "campaign-emerald", null],
  ["craft-bench", "craft-bench", null],
  ["craft-setting", "craft-setting", null],
  ["og-image", "hero-desktop", { left: 0, top: 23, width: 1376, height: 722 }],

  // Collection imagery
  ["collection-rings", "col-rings", null],
  ["collection-necklaces", "col-necklaces", null],
  ["collection-earrings", "col-earrings", null],
  ["collection-bracelets", "col-bracelets", null],
  ["collection-bridal", "col-bridal", null],
  ["collection-signature", "campaign-emerald", { left: 560, top: 0, width: 614, height: 768 }],

  // Product crops, 4:5
  ["product-aurelle-1", "craft-setting", null],
  ["product-aurelle-2", "craft-bench", { left: 205, top: 330, width: 480, height: 600 }],
  ["product-sera-1", "col-rings", { left: 252, top: 340, width: 520, height: 650 }],
  ["product-vow-1", "col-bridal", { left: 230, top: 300, width: 480, height: 600 }],
  ["product-lumen-1", "col-bracelets", { left: 150, top: 250, width: 560, height: 700 }],
  ["product-lumen-2", "col-bridal", { left: 508, top: 380, width: 420, height: 525 }],
  ["product-arc-1", "col-bracelets", { left: 230, top: 340, width: 440, height: 550 }],
  ["product-pear-1", "hero-mobile", { left: 160, top: 560, width: 520, height: 650 }],
  ["product-pear-2", "hero-desktop", { left: 640, top: 34, width: 560, height: 700 }],
  ["product-duet-1", "col-necklaces", { left: 165, top: 280, width: 600, height: 750 }],
  ["product-luna-1", "col-earrings", { left: 170, top: 260, width: 560, height: 700 }],
  ["product-verdant-1", "campaign-emerald", { left: 643, top: 0, width: 614, height: 768 }],
  ["product-verdant-2", "campaign-emerald", { left: 750, top: 180, width: 400, height: 500 }],
];

for (const [name, src, crop] of crops) {
  let img = sharp(join(SRC, `${src}.png`));
  if (crop) img = img.extract(crop);
  if (name === "og-image") img = img.resize(1200, 630, { fit: "cover" });
  const file = join(OUT, `${name}.jpg`);
  const info = await img.jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" }).toFile(file);
  console.log(`${name.padEnd(24)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
