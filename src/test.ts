import { parseAST, ParseType } from "./util.js";

const q =
  "create (:Person { name: 'John' })->[:KNOWS]<-(f:Person { name: 'Jane' }); return f";
const ast = parseAST(ParseType.Query, q);

console.log(JSON.stringify(ast, null, 2));
