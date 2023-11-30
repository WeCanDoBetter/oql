import type {
  AddStatementCstChildren,
  CreateStatementCstChildren,
  DeleteStatementCstChildren,
  EntityCstChildren,
  EntityOrPatternCstChildren,
  LiteralCstChildren,
  MatchClauseCstChildren,
  PerformStatementCstChildren,
  PropertyCstChildren,
  QueryCstChildren,
  RelationshipCstChildren,
  ReturnClauseCstChildren,
  ReturnStatementCstChildren,
  RuleThenClauseCstChildren,
  RuleWhenClauseCstChildren,
  SetPropertyStatementCstChildren,
  StatementCstChildren,
  UnsetPropertyStatementCstChildren,
  WhereClauseCstChildren,
} from "./cst.js";
import { parser } from "./parser.js";

const BaseOQLVisitor = parser.getBaseCstVisitorConstructor();

type Context = any;

export class OQLToAstVisitor extends BaseOQLVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  query(ctx: QueryCstChildren) {
    return {
      type: "query",
      children: ctx.statement.map((s) => this.visit(s)),
    };
  }

  statement(ctx: StatementCstChildren) {
    if (ctx.addStatement) {
      return this.visit(ctx.addStatement);
    } else if (ctx.createStatement) {
      return this.visit(ctx.createStatement);
    } else if (ctx.matchStatement) {
      return this.visit(ctx.matchStatement);
    } else if (ctx.setPropertyStatement) {
      return this.visit(ctx.setPropertyStatement);
    } else if (ctx.unsetPropertyStatement) {
      return this.visit(ctx.unsetPropertyStatement);
    } else if (ctx.deleteStatement) {
      return this.visit(ctx.deleteStatement);
    } else if (ctx.returnStatement) {
      return this.visit(ctx.returnStatement);
    }
  }

  ruleStatement(ctx: Context) {
    // TODO: Support multiple statements in clauses
    return {
      type: "rule",
      when: this.visit(ctx.when[1]),
      then: this.visit(ctx.then[1]),
    };
  }

  ruleWhenClause(ctx: RuleWhenClauseCstChildren) {
    return ctx.matchStatement.map((m) => this.visit(m));
  }

  ruleThenClause(ctx: RuleThenClauseCstChildren) {
    if (ctx.createStatement) {
      return this.visit(ctx.createStatement);
    } else if (ctx.setPropertyStatement) {
      return this.visit(ctx.setPropertyStatement);
    } else if (ctx.unsetPropertyStatement) {
      return this.visit(ctx.unsetPropertyStatement);
    } else if (ctx.deleteStatement) {
      return this.visit(ctx.deleteStatement);
    } else if (ctx.matchStatement) {
      return this.visit(ctx.matchStatement);
    }
  }

  addStatement(ctx: AddStatementCstChildren) {
    return {
      type: "add",
      thingType: ctx.type?.[0].image,
      name: ctx.name?.[0].image,
    };
  }

  createStatement(ctx: CreateStatementCstChildren) {
    return {
      type: "create",
      children: ctx.entityOrPattern.map((e) => this.visit(e)),
    };
  }

  matchStatement(ctx: Context) {
    return {
      type: "match",
      matches: this.visit(ctx.match[1]),
      where: ctx.where?.[1] ? this.visit(ctx.where[1]) : undefined,
    };
  }

  matchClause(ctx: MatchClauseCstChildren) {
    return ctx.entityOrPattern.map((e) => this.visit(e));
  }

  whereClause(ctx: WhereClauseCstChildren) {
    return ctx.condition.map((c) => this.visit(c));
  }

  returnStatement(ctx: ReturnStatementCstChildren) {
    return {
      type: "return",
      children: ctx.returnClause?.map((r) => this.visit(r)),
    };
  }

  returnClause(ctx: ReturnClauseCstChildren) {
    return this.nameOrVisit(ctx.property?.[0]);
  }

  setPropertyStatement(ctx: SetPropertyStatementCstChildren) {
    return {
      type: "set",
      children: ctx.propertyAssignment.map((p) => this.visit(p)),
    };
  }

  propertyAssignment(ctx: Context) {
    return {
      property: this.visit(ctx.property),
      value: this.visit(ctx.value),
    };
  }

  propertyCondition(ctx: Context) {
    return {
      property: this.visit(ctx.property),
      operator: ctx.operator[0].image,
      value: this.visit(ctx.value),
    };
  }

  property(ctx: PropertyCstChildren) {
    return {
      name: ctx.name?.[0].image,
      key: ctx.key[0].image,
    };
  }

  literal(ctx: LiteralCstChildren) {
    return {
      // TODO: Handle type better
      type: ctx.value?.[0].tokenType.name.toLowerCase(),
      value: ctx.value?.[0].image,
    };
  }

  unsetPropertyStatement(ctx: UnsetPropertyStatementCstChildren) {
    return {
      type: "unset",
      children: ctx.property?.map(this.nameOrVisit.bind(this)),
    };
  }

  deleteStatement(ctx: DeleteStatementCstChildren) {
    return {
      type: "delete",
      children: ctx.property?.map(this.nameOrVisit.bind(this)),
    };
  }

  performStatement(ctx: PerformStatementCstChildren) {
    return {
      type: "perform",
      action: ctx.action[0].image,
    };
  }

  entity(ctx: EntityCstChildren) {
    return {
      type: "entity",
      alias: ctx.alias?.[0].image,
      entityType: ctx.type[0].image,
      properties: this.visit(ctx.properties!),
    };
  }

  relationship(ctx: RelationshipCstChildren) {
    return {
      alias: ctx.alias?.[0].image,
      relationshipType: ctx.type[0].image,
    };
  }

  entityOrPattern(ctx: EntityOrPatternCstChildren) {
    const hasPattern = ctx.relationship?.length ?? 0 > 0;

    if (hasPattern) {
      // TODO: Add pattern direction
      const allEntities = [...ctx.entity, ...ctx.target!];
      const allRelationships = ctx.relationship!;
      const triples: any[] = [];

      for (let i = 0; i < allEntities.length; i += 2) {
        triples.push({
          type: "relationship",
          source: this.visit(allEntities[i]),
          relationshipType: allRelationships[i].children.type[0].image,
          target: this.visit(allEntities[i + 1]),
        });
      }

      return {
        type: "pattern",
        children: triples,
      };
    } else {
      return this.visit(ctx.entity);
    }
  }

  propertyObject(ctx: Context) {
    return ctx.key.map((k: any, i: number) => ({
      key: k.image,
      value: this.visit(ctx.value[i]),
    }));
  }

  private nameOrVisit(p: any) {
    if (p.name) {
      return this.visit(p);
    } else {
      return {
        name: p.image,
      };
    }
  }
}
