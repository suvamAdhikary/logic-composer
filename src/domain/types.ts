// Supported fields
export type Field = "Price" | "Category" | "Rating";

// Supported operators
export type Operator =
    | ">"
    | "<"
    | "="
    | "!="
    | ">="
    | "<="
    | "contains";

// Base node structure
interface BaseNode {
    id: string;
}

// Rule node
export interface RuleNode extends BaseNode {
    type: "rule";
    field: Field;
    operator: Operator;
    value: string;
}

// Group node
export interface GroupNode extends BaseNode {
    type: "group";
    operator: "AND" | "OR";
    children: ConditionNode[];
}

// Discriminated union
export type ConditionNode = RuleNode | GroupNode;
