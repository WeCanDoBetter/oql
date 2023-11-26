import { parseAST, ParseType } from "./util.js";

const q = "set p.age = 42; # this is a comment";

const ast = parseAST(ParseType.Query, q);

console.log(JSON.stringify(ast, null, 2));
