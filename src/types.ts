import { ParseType } from "./util.js";
import type {
  QueryCstNode,
  RuleStatementCstNode,
  StatementCstNode,
} from "./cst.js";

/**
 * Cast a `ParseType` to its corresponding CST type.
 * @template T The type to cast.
 */
export type ParseTypeToCSTType<T extends ParseType> = T extends ParseType.Query
  ? QueryCstNode
  : T extends ParseType.Rule ? RuleStatementCstNode
  : T extends ParseType.Statement ? StatementCstNode
  : never;
