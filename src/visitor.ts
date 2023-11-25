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
      statements: ctx.statement.map((s: any) => this.visit(s)),
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
    return {
      type: "rule",
      when: this.visit(ctx.when[1]),
      then: this.visit(ctx.then[1]),
    };
  }

  ruleWhenClause(ctx: Context) {
    return ctx.matchStatement.map((m: any) => this.visit(m));
  }

  // TODO: Support multiple statements in a rule's then clause
  // place them in order in which they appear in the rule
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
      entityType: ctx.type[0].image,
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
    const property = ctx.property[0];

    if (property.name) {
      return this.visit(property);
    } else {
      return {
        name: property.image,
      };
    }
  }

  setPropertyStatement(ctx: Context) {
    return {
      type: "set",
      children: ctx.propertyAssignment.map((p: any) => this.visit(p)),
    };
  }

  propertyAssignment(ctx: Context) {
    const property = this.visit(ctx.property);
    const value = this.visit(ctx.value);

    return {
      property,
      value,
    };
  }

  propertyCondition(ctx: Context) {
    const property = this.visit(ctx.property);
    const operator = ctx.operator[0].image;
    const value = this.visit(ctx.value);

    return {
      property,
      operator,
      value,
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
      type: ctx.value[0].tokenType.name.toLowerCase(),
      value: ctx.value[0].image,
    };
  }

  unsetPropertyStatement(ctx: Context) {
    return {
      type: "unset",
      properties: ctx.property.map((p: any) => {
        if (p.name) {
          return this.visit(p);
        } else {
          return {
            name: p.image,
          };
        }
      }),
    };
  }

  deleteStatement(ctx: Context) {
    return {
      type: "delete",
      properties: ctx.property.map((p: any) => {
        if (p.name) {
          return this.visit(p);
        } else {
          return {
            name: p.image,
          };
        }
      }),
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
      name: ctx.name?.[0].image,
      type: ctx.type[0].image,
      properties: this.visit(ctx.properties),
    };
  }

  relationship(ctx: Context) {
    return {
      name: ctx.name?.[0].image,
      type: ctx.type[0].image,
    };
  }

  entityOrPattern(ctx: Context) {
    const entities = ctx.entity.map((e: any) => this.visit(e));
    const relationships = ctx.relationship?.map((r: any) => this.visit(r));
    const targets = ctx.target?.map((t: any) => this.visit(t));

    return {
      entities,
      relationships,
      targets,
    };
  }

  propertyObject(ctx: Context) {
    return {
      key: ctx.key[0].image,
      value: this.visit(ctx.value),
    };
  }
}
