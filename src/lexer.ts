import { createToken, Lexer } from "chevrotain";

// ------------------ Utilities ------------------
const createKeyword = (keywordText: string) => {
  return createToken({
    name: keywordText,
    pattern: new RegExp(keywordText, "i"),
  });
};

// ------------------ Skippable Tokens ------------------
export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

// ------------------ Symbols and Operators ------------------
export const Period = createToken({ name: "Period", pattern: /\./ });
export const Comma = createToken({ name: "Comma", pattern: /,/ });
export const Colon = createToken({ name: "Colon", pattern: /:/ });
export const Dash = createToken({ name: "Dash", pattern: /-/ });
export const SemiColon = createToken({ name: "SemiColon", pattern: /;/ });
export const Asterisk = createToken({ name: "Asterisk", pattern: /\*/ });
export const Equals = createToken({ name: "Equals", pattern: /=/ });
export const GreaterThan = createToken({ name: "GreaterThan", pattern: />/ });
export const LessThan = createToken({ name: "LessThan", pattern: /</ });
export const Not = createToken({ name: "Not", pattern: /!/ });
export const NotEquals = createToken({ name: "NotEquals", pattern: /!=/ });
export const ArrowLeft = createToken({ name: "ArrowLeft", pattern: /<-/ });
export const ArrowRight = createToken({ name: "ArrowRight", pattern: /->/ });
export const Arrow = createToken({ name: "Arrow", pattern: /->|<-/ });
export const LeftBrace = createToken({ name: "LeftBrace", pattern: /{/ });
export const RightBrace = createToken({ name: "RightBrace", pattern: /}/ });
export const LeftParen = createToken({ name: "LeftParen", pattern: /\(/ });
export const RightParen = createToken({ name: "RightParen", pattern: /\)/ });
export const LeftBracket = createToken({ name: "LeftBracket", pattern: /\[/ });
export const RightBracket = createToken({
  name: "RightBracket",
  pattern: /\]/,
});

// ------------------ Keywords ------------------
export const Add = createKeyword("add");
export const Rule = createKeyword("rule");
export const Create = createKeyword("create");
export const Match = createKeyword("match");
export const Where = createKeyword("where");
export const Return = createKeyword("return");
export const Set = createKeyword("set");
export const Unset = createKeyword("unset");
export const Delete = createKeyword("delete");
export const When = createKeyword("when");
export const Then = createKeyword("then");
export const Perform = createKeyword("perform");

// ------------------ Other Identifiers ------------------
export const Identifier = createToken({
  name: "Identifier",
  pattern: /[A-Za-z][A-Za-z0-9_]*/,
});

export const RelationshipType = createToken({
  name: "RelationshipType",
  pattern: /[A-Z][A-Z0-9_]*/,
});

// ------------------ Values ------------------
export const NumberLiteral = createToken({ name: "Number", pattern: /\d+/ });
export const StringLiteral = createToken({
  name: "String",
  pattern: /"(?:[^\\"]|\\.)*"|'(?:[^\\']|\\.)*'/,
});
export const BooleanLiteral = createToken({
  name: "Boolean",
  pattern: /true|false/i,
});
export const EntityLiteral = createToken({
  name: "EntityLiteral",
  pattern: /Entity/,
});
export const RelationshipLiteral = createToken({
  name: "RelationshipLiteral",
  pattern: /Relationship/,
});

// ------------------ Token List for the Parser ------------------
const allTokens = [
  WhiteSpace,
  SemiColon,
  Asterisk,
  Comma,
  Colon,
  Period,
  Equals,
  NotEquals,
  Not,
  ArrowLeft,
  ArrowRight,
  Arrow,
  Dash,
  GreaterThan,
  LessThan,
  LeftBrace,
  RightBrace,
  LeftParen,
  RightParen,
  LeftBracket,
  RightBracket,
  Add,
  Rule,
  Create,
  Match,
  Where,
  Return,
  Set,
  Unset,
  Delete,
  When,
  Then,
  Perform,
  EntityLiteral,
  RelationshipLiteral,
  Identifier,
  RelationshipType,
  NumberLiteral,
  StringLiteral,
  BooleanLiteral,
];

export { allTokens };
export const lexer = new Lexer(allTokens);
