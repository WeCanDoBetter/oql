import { parser } from "./parser.js";
import { lexer } from "./lexer.js";
import { OQLToAstVisitor } from "./visitor.js";

const toAstVisitorInstance = new OQLToAstVisitor();

/**
 * Visit a CST and return an AST.
 * @param cst The CST to visit.
 */
export const visit = toAstVisitorInstance.visit.bind(toAstVisitorInstance);

/**
 * The type of string to parse.
 *
 * Supported types are:
 * - Query (`ParseType.Query`)
 * - Statement (`ParseType.Statement`)
 * - Rule (`ParseType.Rule`)
 */
export enum ParseType {
  /**
   * A query is a sequence of statements separated by semicolons.
   */
  Query = "query",
  /**
   * A statement is a single operation.
   */
  Statement = "statement",
  /**
   * A rule is a conditional statement.
   */
  Rule = "ruleStatement",
}

/**
 * Parse a string into a Chevrotain CST.
 *
 * Supported types are:
 * - Query (`ParseType.Query`)
 * - Statement (`ParseType.Statement`)
 * - Rule (`ParseType.Rule`)
 * @param type The type of string to parse.
 * @param input The string to parse.
 * @throws {AggregateError} If the input is invalid.
 */
export function parseCST(type: ParseType, input: string) {
  const { tokens } = lexer.tokenize(input);
  parser.input = tokens;
  const cst = parser[type]();

  if (parser.errors.length) {
    throw new AggregateError(parser.errors, `Failed to parse ${type}`);
  }

  return cst;
}

/**
 * Parse a string into an AST.
 *
 * Supported types are:
 * - Query (`ParseType.Query`)
 * - Statement (`ParseType.Statement`)
 * - Rule (`ParseType.Rule`)
 * @param type The type of string to parse.
 * @param input The string to parse.
 * @throws {AggregateError} If the input is invalid.
 */
export function parseAST(type: ParseType, input: string) {
  const cst = parseCST(type, input);
  return toAstVisitorInstance.visit(cst);
}

/**
 * Parse an Odin Query Language query string into an AST.
 * @returns An Odin Query Language AST.
 * @throws {AggregateError} If the query string is invalid.
 */
export function query(strings: TemplateStringsArray, ...keys: string[]) {
  const query = strings.reduce((acc, str, i) => {
    const key = keys[i - 1];
    return acc + key + str;
  });

  return parseAST(ParseType.Query, query);
}

/**
 * Parse an Odin Query Language statement string into an AST.
 * @returns An Odin Query Language AST.
 * @throws {AggregateError} If the statement string is invalid.
 */
export function statement(strings: TemplateStringsArray, ...keys: string[]) {
  const statement = strings.reduce((acc, str, i) => {
    const key = keys[i - 1];
    return acc + key + str;
  });

  return parseAST(ParseType.Statement, statement);
}

/**
 * Parse an Odin Query Language rule string into an AST.
 * @returns An Odin Query Language AST.
 * @throws {AggregateError} If the rule string is invalid.
 */
export function rule(strings: TemplateStringsArray, ...keys: string[]) {
  const rule = strings.reduce((acc, str, i) => {
    const key = keys[i - 1];
    return acc + key + str;
  });

  return parseAST(ParseType.Rule, rule);
}
