import { parseAST, ParseType } from "./util.js";

const q =
  "create (:Person { name: 'John', age: 42 })->[:KNOWS]<-(f:Person { name: 'Jane' }), (:City) return f";
const ast = parseAST(ParseType.Query, q);

console.log(JSON.stringify(ast, null, 2));
