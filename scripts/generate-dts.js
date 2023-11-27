import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { generateCstDts } from "chevrotain";
import { fileURLToPath } from "url";
import { parser } from "../dist/parser.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const productions = parser.getGAstProductions();

const dtsString = generateCstDts(productions);
const dtsPath = resolve(__dirname, "../src/", "cst.ts");
writeFileSync(dtsPath, dtsString);