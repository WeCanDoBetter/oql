import type { ParseTypeToCSTType } from "./types.js";
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
export function parseCST<T extends ParseType>(
  type: T,
  input: string,
): ParseTypeToCSTType<T> {
  const { tokens } = lexer.tokenize(input);
  parser.input = tokens;
  const cst = parser[type]();

  if (parser.errors.length) {
    throw new AggregateError(parser.errors, `Failed to parse ${type}`);
  }

  return cst as ParseTypeToCSTType<T>;
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
export function query(input: string) {
  return parseAST(ParseType.Query, input);
}

/**
 * Parse an Odin Query Language statement string into an AST.
 * @returns An Odin Query Language AST.
 * @throws {AggregateError} If the statement string is invalid.
 */
export function statement(input: string) {
  return parseAST(ParseType.Statement, input);
}

/**
 * Parse an Odin Query Language rule string into an AST.
 * @returns An Odin Query Language AST.
 * @throws {AggregateError} If the rule string is invalid.
 */
export function rule(input: string) {
  return parseAST(ParseType.Rule, input);
}
