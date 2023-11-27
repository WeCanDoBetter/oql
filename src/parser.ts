import { CstParser } from "chevrotain";
import {
  Add,
  allTokens,
  ArrowLeft,
  ArrowRight,
  Asterisk,
  BooleanLiteral,
  Colon,
  Comma,
  Create,
  Dash,
  Delete,
  EntityLiteral,
  Equals,
  GreaterThan,
  Identifier,
  LeftBrace,
  LeftBracket,
  LeftParen,
  LessThan,
  Match,
  Not,
  NotEquals,
  NumberLiteral,
  Perform,
  Period,
  RelationshipLiteral,
  RelationshipType,
  Return,
  RightBrace,
  RightBracket,
  RightParen,
  Rule,
  SemiColon,
  Set,
  StringLiteral,
  Then,
  Unset,
  When,
  Where,
} from "./lexer.js";

class OqlParser extends CstParser {
  constructor() {
    super(allTokens, { recoveryEnabled: true });
    this.performSelfAnalysis();
  }

  /**
   * A query consists of one or more statements separated by semicolons.
   */
  public query = this.RULE("query", () => {
    this.OPTION(() => {
      this.SUBRULE(this.performStatement);
      this.OPTION1(() => this.CONSUME(SemiColon));
    });
    this.AT_LEAST_ONE(() => {
      this.SUBRULE(this.statement);
    });
  });

  public statement = this.RULE("statement", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.addStatement) },
      { ALT: () => this.SUBRULE(this.createStatement) },
      { ALT: () => this.SUBRULE(this.matchStatement) },
      { ALT: () => this.SUBRULE(this.returnStatement) },
      { ALT: () => this.SUBRULE(this.setPropertyStatement) },
      { ALT: () => this.SUBRULE(this.unsetPropertyStatement) },
      { ALT: () => this.SUBRULE(this.deleteStatement) },
    ]);
    this.OPTION(() => this.CONSUME(SemiColon));
  });

  /**
   * ```
   * rule <identifier> when {
   *   <statements>
   * } then {
   *  <statements>
   * }
   * ```
   */
  public ruleStatement = this.RULE("ruleStatement", () => {
    this.CONSUME(Rule);
    this.OPTION(() => this.CONSUME(Identifier, { LABEL: "name" }));
    this.CONSUME(When);
    this.CONSUME(LeftBrace);
    this.SUBRULE(this.ruleWhenClause, { LABEL: "when" });
    this.CONSUME(RightBrace);
    this.CONSUME(Then);
    this.CONSUME1(LeftBrace);
    this.SUBRULE(this.ruleThenClause, { LABEL: "then" });
    this.CONSUME1(RightBrace);
  });

  private ruleWhenClause = this.RULE("ruleWhenClause", () => {
    this.AT_LEAST_ONE(() => {
      this.SUBRULE(this.matchStatement);
      this.OPTION(() => this.CONSUME(SemiColon));
    });
  });

  private ruleThenClause = this.RULE("ruleThenClause", () => {
    this.AT_LEAST_ONE(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.createStatement) },
        { ALT: () => this.SUBRULE(this.matchStatement) },
        { ALT: () => this.SUBRULE(this.setPropertyStatement) },
        { ALT: () => this.SUBRULE(this.unsetPropertyStatement) },
        { ALT: () => this.SUBRULE(this.deleteStatement) },
      ]);
      this.OPTION(() => this.CONSUME(SemiColon));
    });
  });

  private addStatement = this.RULE("addStatement", () => {
    this.CONSUME(Add);
    this.OR([
      {
        ALT: () => {
          this.CONSUME(EntityLiteral, { LABEL: "type" });
          this.CONSUME(Identifier, { LABEL: "name" });
        },
      },
      {
        ALT: () => {
          this.CONSUME(RelationshipLiteral, { LABEL: "type" });
          this.CONSUME1(Identifier, { LABEL: "name" });
        },
      },
    ]);
  });

  // create (p:Person { name: "John" })-[r:KNOWS]->(p2:Person { name: "Jane" })
  private createStatement = this.RULE("createStatement", () => {
    this.CONSUME(Create);
    this.AT_LEAST_ONE_SEP({
      SEP: Comma,
      DEF: () =>
        this.SUBRULE(this.entityOrPattern, { LABEL: "entityOrPattern" }),
    });
  });

  private matchStatement = this.RULE("matchStatement", () => {
    this.CONSUME(Match);
    this.SUBRULE(this.matchClause, { LABEL: "match" });
    this.OPTION(() => {
      this.CONSUME(Where);
      this.SUBRULE(this.whereClause, { LABEL: "where" });
    });
  });

  // match (p:Person { name: "John" })-[r:KNOWS]->(p2:Person { name: "Jane" })
  private matchClause = this.RULE("matchClause", () => {
    this.AT_LEAST_ONE_SEP({
      SEP: Comma,
      DEF: () =>
        this.SUBRULE(this.entityOrPattern, { LABEL: "entityOrPattern" }),
    });
  });

  // where p.name = "John", p.age > 18
  private whereClause = this.RULE("whereClause", () => {
    this.AT_LEAST_ONE_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.propertyCondition, { LABEL: "condition" }),
    });
  });

  // return p, r, f
  private returnStatement = this.RULE("returnStatement", () => {
    this.CONSUME(Return);
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.returnClause),
    });
  });

  private returnClause = this.RULE("returnClause", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.property, { LABEL: "property" }) },
      { ALT: () => this.CONSUME(Identifier, { LABEL: "property" }) },
    ]);
  });

  private setPropertyStatement = this.RULE("setPropertyStatement", () => {
    this.CONSUME(Set);
    this.AT_LEAST_ONE_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.propertyAssignment),
    });
  });

  private propertyAssignment = this.RULE("propertyAssignment", () => {
    this.SUBRULE(this.property, { LABEL: "property" });
    this.CONSUME(Equals, { LABEL: "operator" });
    this.OR([
      { ALT: () => this.SUBRULE(this.literal, { LABEL: "value" }) },
      { ALT: () => this.SUBRULE1(this.property, { LABEL: "value" }) },
      { ALT: () => this.CONSUME(Identifier, { LABEL: "value" }) },
    ]);
  });

  private propertyCondition = this.RULE("propertyCondition", () => {
    this.SUBRULE(this.property, { LABEL: "property" });
    this.OR([
      { ALT: () => this.CONSUME(Equals, { LABEL: "operator" }) },
      { ALT: () => this.CONSUME(NotEquals, { LABEL: "operator" }) },
      { ALT: () => this.CONSUME(LessThan, { LABEL: "operator" }) },
      { ALT: () => this.CONSUME(GreaterThan, { LABEL: "operator" }) },
      { ALT: () => this.CONSUME(Not, { LABEL: "operator" }) },
    ]);
    this.OR1([
      { ALT: () => this.SUBRULE(this.literal, { LABEL: "value" }) },
      { ALT: () => this.SUBRULE1(this.property, { LABEL: "value" }) },
      { ALT: () => this.CONSUME(Identifier, { LABEL: "value" }) },
    ]);
  });

  private property = this.RULE("property", () => {
    this.CONSUME(Identifier, { LABEL: "name" });
    this.CONSUME(Period);
    this.CONSUME1(Identifier, { LABEL: "key" });
  });

  private literal = this.RULE("literal", () => {
    this.OR([
      { ALT: () => this.CONSUME(StringLiteral, { LABEL: "value" }) },
      { ALT: () => this.CONSUME(NumberLiteral, { LABEL: "value" }) },
      { ALT: () => this.CONSUME(BooleanLiteral, { LABEL: "value" }) },
    ]);
  });

  private unsetPropertyStatement = this.RULE("unsetPropertyStatement", () => {
    this.CONSUME(Unset);
    this.AT_LEAST_ONE_SEP({
      SEP: Comma,
      DEF: () => {
        this.OR([
          { ALT: () => this.SUBRULE(this.property, { LABEL: "property" }) },
          { ALT: () => this.CONSUME(Identifier, { LABEL: "property" }) },
        ]);
      },
    });
  });

  private deleteStatement = this.RULE("deleteStatement", () => {
    this.CONSUME(Delete);
    this.AT_LEAST_ONE_SEP({
      SEP: Comma,
      DEF: () => {
        this.OR([
          { ALT: () => this.SUBRULE(this.property, { LABEL: "property" }) },
          { ALT: () => this.CONSUME(Identifier, { LABEL: "property" }) },
        ]);
      },
    });
  });

  private performStatement = this.RULE("performStatement", () => {
    this.CONSUME(Perform);
    this.CONSUME(Identifier, { LABEL: "action" });
  });

  /** `(p:Person { name: "John" })` */
  public entity = this.RULE("entity", () => {
    this.CONSUME(LeftParen);
    this.OPTION(() => this.CONSUME(Identifier, { LABEL: "alias" }));
    this.CONSUME(Colon);
    this.CONSUME1(Identifier, { LABEL: "type" });
    this.OPTION1(() =>
      this.SUBRULE(this.propertyObject, { LABEL: "properties" })
    );
    this.CONSUME(RightParen);
  });

  /** `[r:RELATIONSHIP_TYPE]` */
  public relationship = this.RULE("relationship", () => {
    this.CONSUME(LeftBracket);
    this.OPTION(() => this.CONSUME(Identifier, { LABEL: "alias" }));
    this.CONSUME(Colon);
    this.CONSUME1(Identifier, { LABEL: "type" });
    this.OPTION1(() => {
      this.CONSUME(Asterisk);
      this.OPTION2(() => this.CONSUME(NumberLiteral, { LABEL: "hops" }));
    });
    this.CONSUME(RightBracket);
  });

  public entityOrPattern = this.RULE("entityOrPattern", () => {
    this.SUBRULE(this.entity, { LABEL: "entity" });
    this.OPTION(() => {
      this.OR([
        // Option for bi-directional relationship
        {
          ALT: () => {
            this.CONSUME(ArrowRight);
            this.SUBRULE(this.relationship, { LABEL: "relationship" });
            this.CONSUME(ArrowLeft);
            this.SUBRULE1(this.entity, { LABEL: "target" });
          },
        },
        // Option for unidirectional/chained relationships
        {
          ALT: () => {
            this.AT_LEAST_ONE(() => {
              this.CONSUME(Dash);
              this.SUBRULE2(this.relationship, { LABEL: "relationship" });
              this.MANY(() => {
                this.CONSUME1(Dash);
                this.SUBRULE2(this.entity, { LABEL: "entity" });
                this.CONSUME2(Dash);
                this.SUBRULE3(this.relationship, { LABEL: "relationship" });
              });
              this.CONSUME1(ArrowRight);
              this.SUBRULE3(this.entity, { LABEL: "target" });
            });
          },
        },
      ]);
    });
  });

  private propertyObject = this.RULE("propertyObject", () => {
    this.CONSUME(LeftBrace);
    this.AT_LEAST_ONE_SEP({
      SEP: Comma,
      DEF: () => {
        this.CONSUME(Identifier, { LABEL: "key" });
        this.CONSUME(Colon);
        this.OR([
          { ALT: () => this.SUBRULE(this.literal, { LABEL: "value" }) },
          { ALT: () => this.CONSUME1(Identifier, { LABEL: "value" }) },
        ]);
      },
    });
    this.CONSUME(RightBrace);
  });
}

export const parser = new OqlParser();
