/* This file is generated, do not modify it directly!*/
import type { CstNode, ICstVisitor, IToken } from "chevrotain";

export interface QueryCstNode extends CstNode {
  name: "query";
  children: QueryCstChildren;
}

export type QueryCstChildren = {
  performStatement?: PerformStatementCstNode[];
  SemiColon?: IToken[];
  statement: StatementCstNode[];
};

export interface StatementCstNode extends CstNode {
  name: "statement";
  children: StatementCstChildren;
}

export type StatementCstChildren = {
  addStatement?: AddStatementCstNode[];
  createStatement?: CreateStatementCstNode[];
  matchStatement?: MatchStatementCstNode[];
  returnStatement?: ReturnStatementCstNode[];
  setPropertyStatement?: SetPropertyStatementCstNode[];
  unsetPropertyStatement?: UnsetPropertyStatementCstNode[];
  deleteStatement?: DeleteStatementCstNode[];
  SemiColon?: IToken[];
};

export interface RuleStatementCstNode extends CstNode {
  name: "ruleStatement";
  children: RuleStatementCstChildren;
}

export type RuleStatementCstChildren = {
  rule: IToken[];
  name?: IToken[];
  when: (IToken | RuleWhenClauseCstNode)[];
  LeftBrace: (IToken)[];
  RightBrace: (IToken)[];
  then: (IToken | RuleThenClauseCstNode)[];
};

export interface RuleWhenClauseCstNode extends CstNode {
  name: "ruleWhenClause";
  children: RuleWhenClauseCstChildren;
}

export type RuleWhenClauseCstChildren = {
  matchStatement: MatchStatementCstNode[];
  SemiColon?: IToken[];
};

export interface RuleThenClauseCstNode extends CstNode {
  name: "ruleThenClause";
  children: RuleThenClauseCstChildren;
}

export type RuleThenClauseCstChildren = {
  createStatement?: CreateStatementCstNode[];
  matchStatement?: MatchStatementCstNode[];
  setPropertyStatement?: SetPropertyStatementCstNode[];
  unsetPropertyStatement?: UnsetPropertyStatementCstNode[];
  deleteStatement?: DeleteStatementCstNode[];
  SemiColon?: IToken[];
};

export interface AddStatementCstNode extends CstNode {
  name: "addStatement";
  children: AddStatementCstChildren;
}

export type AddStatementCstChildren = {
  add: IToken[];
  type?: (IToken)[];
  name?: (IToken)[];
};

export interface CreateStatementCstNode extends CstNode {
  name: "createStatement";
  children: CreateStatementCstChildren;
}

export type CreateStatementCstChildren = {
  create: IToken[];
  entityOrPattern: EntityOrPatternCstNode[];
  Comma?: IToken[];
};

export interface MatchStatementCstNode extends CstNode {
  name: "matchStatement";
  children: MatchStatementCstChildren;
}

export type MatchStatementCstChildren = {
  match: (IToken | MatchClauseCstNode)[];
  where?: (IToken | WhereClauseCstNode)[];
};

export interface MatchClauseCstNode extends CstNode {
  name: "matchClause";
  children: MatchClauseCstChildren;
}

export type MatchClauseCstChildren = {
  entityOrPattern: EntityOrPatternCstNode[];
  Comma?: IToken[];
};

export interface WhereClauseCstNode extends CstNode {
  name: "whereClause";
  children: WhereClauseCstChildren;
}

export type WhereClauseCstChildren = {
  condition: PropertyConditionCstNode[];
  Comma?: IToken[];
};

export interface ReturnStatementCstNode extends CstNode {
  name: "returnStatement";
  children: ReturnStatementCstChildren;
}

export type ReturnStatementCstChildren = {
  return: IToken[];
  returnClause?: ReturnClauseCstNode[];
  Comma?: IToken[];
};

export interface ReturnClauseCstNode extends CstNode {
  name: "returnClause";
  children: ReturnClauseCstChildren;
}

export type ReturnClauseCstChildren = {
  property?: (PropertyCstNode | IToken)[];
};

export interface SetPropertyStatementCstNode extends CstNode {
  name: "setPropertyStatement";
  children: SetPropertyStatementCstChildren;
}

export type SetPropertyStatementCstChildren = {
  set: IToken[];
  propertyAssignment: PropertyAssignmentCstNode[];
  Comma?: IToken[];
};

export interface PropertyAssignmentCstNode extends CstNode {
  name: "propertyAssignment";
  children: PropertyAssignmentCstChildren;
}

export type PropertyAssignmentCstChildren = {
  property: PropertyCstNode[];
  operator: IToken[];
  value?: (LiteralCstNode | PropertyCstNode | IToken)[];
};

export interface PropertyConditionCstNode extends CstNode {
  name: "propertyCondition";
  children: PropertyConditionCstChildren;
}

export type PropertyConditionCstChildren = {
  property: PropertyCstNode[];
  operator?: (IToken)[];
  value?: (LiteralCstNode | PropertyCstNode | IToken)[];
};

export interface PropertyCstNode extends CstNode {
  name: "property";
  children: PropertyCstChildren;
}

export type PropertyCstChildren = {
  name: IToken[];
  Period: IToken[];
  key: IToken[];
};

export interface LiteralCstNode extends CstNode {
  name: "literal";
  children: LiteralCstChildren;
}

export type LiteralCstChildren = {
  value?: (IToken)[];
};

export interface UnsetPropertyStatementCstNode extends CstNode {
  name: "unsetPropertyStatement";
  children: UnsetPropertyStatementCstChildren;
}

export type UnsetPropertyStatementCstChildren = {
  unset: IToken[];
  property?: (PropertyCstNode | IToken)[];
  Comma?: IToken[];
};

export interface DeleteStatementCstNode extends CstNode {
  name: "deleteStatement";
  children: DeleteStatementCstChildren;
}

export type DeleteStatementCstChildren = {
  delete: IToken[];
  property?: (PropertyCstNode | IToken)[];
  Comma?: IToken[];
};

export interface PerformStatementCstNode extends CstNode {
  name: "performStatement";
  children: PerformStatementCstChildren;
}

export type PerformStatementCstChildren = {
  perform: IToken[];
  action: IToken[];
};

export interface EntityCstNode extends CstNode {
  name: "entity";
  children: EntityCstChildren;
}

export type EntityCstChildren = {
  LeftParen: IToken[];
  alias?: IToken[];
  Colon: IToken[];
  type: IToken[];
  properties?: PropertyObjectCstNode[];
  RightParen: IToken[];
};

export interface RelationshipCstNode extends CstNode {
  name: "relationship";
  children: RelationshipCstChildren;
}

export type RelationshipCstChildren = {
  LeftBracket: IToken[];
  alias?: IToken[];
  Colon: IToken[];
  type: IToken[];
  Asterisk?: IToken[];
  hops?: IToken[];
  RightBracket: IToken[];
};

export interface EntityOrPatternCstNode extends CstNode {
  name: "entityOrPattern";
  children: EntityOrPatternCstChildren;
}

export type EntityOrPatternCstChildren = {
  entity: (EntityCstNode)[];
  ArrowRight?: (IToken)[];
  relationship?: (RelationshipCstNode)[];
  ArrowLeft?: IToken[];
  target?: (EntityCstNode)[];
  Dash?: (IToken)[];
};

export interface PropertyObjectCstNode extends CstNode {
  name: "propertyObject";
  children: PropertyObjectCstChildren;
}

export type PropertyObjectCstChildren = {
  LeftBrace: IToken[];
  key: IToken[];
  Colon: IToken[];
  value?: (LiteralCstNode | IToken)[];
  Comma?: IToken[];
  RightBrace: IToken[];
};

export interface ICstNodeVisitor<IN, OUT> extends ICstVisitor<IN, OUT> {
  query(children: QueryCstChildren, param?: IN): OUT;
  statement(children: StatementCstChildren, param?: IN): OUT;
  ruleStatement(children: RuleStatementCstChildren, param?: IN): OUT;
  ruleWhenClause(children: RuleWhenClauseCstChildren, param?: IN): OUT;
  ruleThenClause(children: RuleThenClauseCstChildren, param?: IN): OUT;
  addStatement(children: AddStatementCstChildren, param?: IN): OUT;
  createStatement(children: CreateStatementCstChildren, param?: IN): OUT;
  matchStatement(children: MatchStatementCstChildren, param?: IN): OUT;
  matchClause(children: MatchClauseCstChildren, param?: IN): OUT;
  whereClause(children: WhereClauseCstChildren, param?: IN): OUT;
  returnStatement(children: ReturnStatementCstChildren, param?: IN): OUT;
  returnClause(children: ReturnClauseCstChildren, param?: IN): OUT;
  setPropertyStatement(
    children: SetPropertyStatementCstChildren,
    param?: IN,
  ): OUT;
  propertyAssignment(children: PropertyAssignmentCstChildren, param?: IN): OUT;
  propertyCondition(children: PropertyConditionCstChildren, param?: IN): OUT;
  property(children: PropertyCstChildren, param?: IN): OUT;
  literal(children: LiteralCstChildren, param?: IN): OUT;
  unsetPropertyStatement(
    children: UnsetPropertyStatementCstChildren,
    param?: IN,
  ): OUT;
  deleteStatement(children: DeleteStatementCstChildren, param?: IN): OUT;
  performStatement(children: PerformStatementCstChildren, param?: IN): OUT;
  entity(children: EntityCstChildren, param?: IN): OUT;
  relationship(children: RelationshipCstChildren, param?: IN): OUT;
  entityOrPattern(children: EntityOrPatternCstChildren, param?: IN): OUT;
  propertyObject(children: PropertyObjectCstChildren, param?: IN): OUT;
}
