# Odin Query Language (OQL)

A knowledge graph query language designed for use with
[Odin](https://wecandobetter.github.io/odin/), an **in-memory**,
**browser-first** knowledge graph database. It is based on Cyper, the query
language used by [Neo4j](https://neo4j.com/).

> ⚠️ This project is still in the early stages of development. It is not yet
> ready for use. Tinker with it if you like, but don't come to me when it burns
> down your house. You've been warned.

## Introduction

Odin Query Language (OQL) is a query language for knowledge graphs. It is
designed to be used with [Odin](https://wecandobetter.github.io/odin/), an
in-memory knowledge graph database optimized for use in the browser.

## Installation

```bash
git clone https://github.com/WeCanDoBetter/oql.git
cd oql
npm install
```

## Usage

> ⚠️ The grammar and parser are incomplete and still in flux. The examples below
> may not work as expected. Expect breaking changes.

### Parse a string into an abstract syntax tree (AST)

```ts
import {
  parseAST,
  ParseType,
  query,
  rule,
  statement,
} from "@wecandobetter/oql";

// Parse a query into an abstract syntax tree (AST).
// A query consists of one or more statements.
const queryTree = query("match (p:Person); return p;");

// Parse a statement into an AST.
const statementTree = statement("match (p:Person);");

// Parse a rule into an AST.
// A rule consists of an optional name, a when clause, and a then clause.
const ruleTree = rule(`
  rule MyRule when {
    match (p:Person);
  } then {
    create p->[:WORKS_FOR]->(:Company {name: 'Acme'});
  }
`);

// Use the parse function to parse a string into an AST.
// Supports `query`, `statement`, and `rule` types.
const ast = parseAST(ParseType.Statement, "match (p:Person);");
```

If you want the [Chevrotain](https://chevrotain.io/) concrete syntax tree (CST),
you can get it from the `parseCST` function.

```ts
import { parseCST } from "@wecandobetter/oql";

const cst = parseCST("match (p:Person);");
```

## Roadmap

- [ ] Finalize the grammar.
- [ ] Finalize the AST.
- [ ] Finalize the parser.
- [ ] Write unit tests.
- [ ] Develop a runtime which executes queries against an Odin knowledge graph.
- [ ] Optimizations.

## Contributing

Contributions are welcome! If you encounter a bug, have a question, or have an
idea for a new feature, please open an issue. If you would like to contribute
code, please open an issue first to discuss your idea.

## License

OQL is licensed under the [MIT License](LICENSE).

## Links

- [Odin Knowledge Graph](https://wecandobetter.github.io/odin/)
- [We Can Do Better](https://wcdb.life/)

Coded with ❤️ by [We Can Do Better](https://wcdb.life/).
