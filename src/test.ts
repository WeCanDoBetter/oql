import { parseAST, ParseType } from "./util.js";

const q =
  "create (p:Person); create (:Person)-[r:KNOWS]->(c:City { name: 'The Hague' }); set p.age = 42; return p, p.name;";

const ast = parseAST(ParseType.Query, q);

console.log(JSON.stringify(ast, null, 2));
