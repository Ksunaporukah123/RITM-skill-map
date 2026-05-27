import { mdToPdf } from "md-to-pdf";
import { mkdir, readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const sectionsDir = path.join(projectRoot, "docs/goals-user-guide/sections");
const pdfDir = path.join(projectRoot, "docs/goals-user-guide/pdf");
const stylesheetPath = path.join(projectRoot, "docs/goals-user-guide/pdf-style.css");

await mkdir(pdfDir, { recursive: true });

const files = (await readdir(sectionsDir))
  .filter((f) => f.endsWith(".md"))
  .sort();

for (const file of files) {
  const inputPath = path.join(sectionsDir, file);
  const outputPath = path.join(pdfDir, file.replace(/\.md$/i, ".pdf"));
  process.stdout.write(`PDF: ${file} ... `);
  await mdToPdf(
    { path: inputPath },
    {
      dest: outputPath,
      basedir: sectionsDir,
      stylesheet: [stylesheetPath],
      pdf_options: { format: "A4", margin: "20mm 15mm" },
    }
  );
  console.log("OK");
}

console.log(`\nГотово: ${files.length} файлов в docs/goals-user-guide/pdf/`);
