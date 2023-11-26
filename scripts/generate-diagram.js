/**
 * A template for generating syntax diagrams html file.
 * See: https://github.com/chevrotain/chevrotain/tree/master/diagrams for more details
 */

import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createSyntaxDiagramsCode } from "chevrotain";
import { parser } from "../dist/parser.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// extract the serialized grammar.
const serializedGrammar = parser.getSerializedGastProductions();

// create the HTML Text
const htmlText = createSyntaxDiagramsCode(serializedGrammar);

// Write the HTML file to disk
const outPath = path.resolve(__dirname, "../docs");
fs.writeFileSync(outPath + "/generated_diagrams.html", htmlText);