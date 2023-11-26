import { parseAST, ParseType } from "./util.js";

const q = "set p.age = 42; unset p.age; delete p; perform inference;";

const ast = parseAST(ParseType.Query, q);

console.log(JSON.stringify(ast, null, 2));
