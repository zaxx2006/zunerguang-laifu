import path from "node:path";
import sharp from "sharp";

const directory = path.resolve("public/home-preview/bright");
for (const name of ["assessment-living-reference", "assessment-family-beach", "paper-grain"]) {
  const output = await sharp(path.join(directory, `${name}.png`)).webp({ quality: 80, effort: 6 }).toFile(path.join(directory, `${name}.webp`));
  console.log(`Prepared ${name}.webp: ${output.size} bytes`);
}

const invitation = await sharp("public/home-preview/closing-invitation.webp")
  .resize({ width: 1280, withoutEnlargement: true })
  .webp({ quality: 75, effort: 6 })
  .toFile("public/home-preview/closing-invitation-1280.webp");
console.log(`Prepared closing-invitation-1280.webp: ${invitation.size} bytes`);
