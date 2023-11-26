import { parser } from "./parser.js";

const BaseOQLVisitor = parser.getBaseCstVisitorConstructor();

type Context = any;

export class OQLToAstVisitor extends BaseOQLVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  query(ctx: Context) {
    return {
      type: "query",
      children: ctx.statement.map((s: any) => this.visit(s)),
    };
  }

  statement(ctx: Context) {
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
    } else if (ctx.performStatement) {
      return this.visit(ctx.performStatement);
    } else if (ctx.ruleStatement) {
      return this.visit(ctx.ruleStatement);
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

  ruleWhenClause(ctx: Context) {
    return ctx.matchStatement.map((m: any) => this.visit(m));
  }

  ruleThenClause(ctx: Context) {
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

  addStatement(ctx: Context) {
    return {
      type: "add",
      thingType: ctx.type[0].image,
      name: ctx.name?.[0].image,
    };
  }

  createStatement(ctx: Context) {
    return {
      type: "create",
      children: ctx.entityOrPattern.map((e: any) => this.visit(e)),
    };
  }

  matchStatement(ctx: Context) {
    return {
      type: "match",
      matches: this.visit(ctx.match[1]),
      where: ctx.where?.[1] ? this.visit(ctx.where[1]) : undefined,
    };
  }

  matchClause(ctx: Context) {
    return ctx.entityOrPattern.map((e: any) => this.visit(e));
  }

  whereClause(ctx: Context) {
    return ctx.condition.map((c: any) => this.visit(c));
  }

  returnStatement(ctx: Context) {
    return {
      type: "return",
      children: ctx.returnClause.map((r: any) => this.visit(r)),
    };
  }

  returnClause(ctx: Context) {
    return this.nameOrVisit(ctx.property[0]);
  }

  setPropertyStatement(ctx: Context) {
    return {
      type: "set",
      children: ctx.propertyAssignment.map((p: any) => this.visit(p)),
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

  property(ctx: Context) {
    return {
      name: ctx.name?.[0].image,
      key: ctx.key[0].image,
    };
  }

  literal(ctx: Context) {
    return {
      // TODO: Handle type better
      type: ctx.value[0].tokenType.name.toLowerCase(),
      value: ctx.value[0].image,
    };
  }

  unsetPropertyStatement(ctx: Context) {
    return {
      type: "unset",
      children: ctx.property.map(this.nameOrVisit.bind(this)),
    };
  }

  deleteStatement(ctx: Context) {
    return {
      type: "delete",
      children: ctx.property.map(this.nameOrVisit.bind(this)),
    };
  }

  performStatement(ctx: Context) {
    return {
      type: "perform",
      action: ctx.action[0].image,
    };
  }

  entity(ctx: Context) {
    return {
      type: "entity",
      name: ctx.name?.[0].image,
      entityType: ctx.type[0].image,
      properties: this.visit(ctx.properties),
    };
  }

  relationship(ctx: Context) {
    return {
      name: ctx.name?.[0].image,
      relationshipType: ctx.type[0].image,
    };
  }

  entityOrPattern(ctx: Context) {
    const hasPattern = ctx.relationship?.length > 0;

    if (hasPattern) {
      // TODO: Add pattern direction
      const allEntities = [...ctx.entity, ...ctx.target];
      const allRelationships = ctx.relationship;
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
