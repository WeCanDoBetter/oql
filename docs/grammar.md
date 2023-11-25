# Odin Query Language (OQL) Grammar

> ⚠️ The grammar is still in flux. The grammar below may not be up to date.

```
OQL_Grammar
    : StatementList

StatementList
    : Statement
    | StatementList Statement

Statement
    : EntityStatement
    | RelationshipStatement
    | CreateStatement
    | MatchStatement
    | ReturnStatement
    | SetPropertyStatement
    | UnsetPropertyStatement
    | DeleteStatement
    | RuleStatement
    | InferenceStatement

EntityStatement
    : 'add Entity' EntityName ';'

RelationshipStatement
    : 'add Relationship' RelationshipName ';'

CreateStatement
    : 'create' CreateClauseList ';'

MatchStatement
    : 'match' MatchClauseList

ReturnStatement
    : 'return' ReturnClause

SetPropertyStatement
    : 'set' PropertyAssignment ';'

UnsetPropertyStatement
    : 'unset' PropertyUnassignment ';'

DeleteStatement
    : 'delete' DeleteClauseList

RuleStatement
    : 'when' '{' StatementList '}' 'then' '{' StatementList '}'

InferenceStatement
    : 'perform inference;'

CreateClauseList
    : CreateClause
    | CreateClauseList ',' CreateClause

MatchClauseList
    : MatchClause
    | MatchClauseList ',' MatchClause

DeleteClauseList
    : DeleteClause
    | DeleteClauseList ',' DeleteClause

CreateClause
    : EntityCreation
    | RelationshipCreation

MatchClause
    : PathExpression
    | PathExpression 'where' ConditionExpression

ReturnClause
    : 
    | ReturnItem
    | ReturnClause ',' ReturnItem

ActionClause
    : CreateClause
    | SetPropertyStatement
    | DeleteStatement

EntityName
    : Identifier

RelationshipName
    : Identifier

EntityCreation
    : '(' VariableOpt ':' EntityName EntityPropertiesOpt ')'

RelationshipCreation
    : VariableOpt '->' '[' VariableOpt ':' RelationshipName ']' '->' VariableOpt
    | VariableOpt '<-' '[' VariableOpt ':' RelationshipName ']' '<-' VariableOpt

PathExpression
    : SinglePathExpression
    | SinglePathExpression ',' PathExpression

SinglePathExpression
    : EntityPath RelationshipPath
    | EntityPath RelationshipPath EntityPath

EntityPath
    : '(' VariableOpt ':' EntityName EntityPropertiesOpt ')'

RelationshipPath
    : RelationshipSegment
    | RelationshipPath RelationshipSegment

RelationshipSegment
    : '-' RelationshipDirectional '-'
    | '->' RelationshipDirectional '<-'
    | RelationshipDirectional '->'
    | RelationshipDirectional '<-'

RelationshipDirectional
    : '[' VariableOpt ':' RelationshipType ']'

ReturnItem
    : Variable
    | EntityProperties

Direction
    : '->' EntityPath
    | '<-' EntityPath
    | '<-' EntityPath '->'

RelationshipType
    : Identifier

PropertyAssignment
    : Variable '.' PropertyName '=' PropertyValue

PropertyUnassignment
    : Variable '.' PropertyName

DeleteClause
    : VariableOpt
    | '(' VariableOpt ':' EntityName EntityPropertiesOpt ')'

EntityPropertiesOpt
    : 
    | EntityProperties

EntityProperties
    : '{' PropertyList '}'

PropertyList
    : Property
    | PropertyList ',' Property

Property
    : PropertyName ':' PropertyValue

PropertyName
    : Identifier

PropertyValue
    : Number
    | String
    | Boolean

VariableOpt
    : 
    | Variable

Variable
    : Identifier

Identifier
    : Letter (Letter | Digit)*

Letter
    : [a-zA-Z]

Digit
    : [0-9]

NumberOpt
    : 
    | Number

Number
    : Digit+

String
    : '"' [^"]* '"'
    | '\'' [^\']* '\''

Boolean
    : 'true'
    | 'false'
```
