import { generateId } from "../shared/uid";
import type { RuleNode, GroupNode, ConditionNode } from "./types";

export function createRule(): RuleNode {
    return {
        id: generateId(),
        type: "rule",
        field: "Price",
        operator: ">",
        value: ""
    };
}

export function createGroup(): GroupNode {
    return {
        id: generateId(),
        type: "group",
        operator: "AND",
        children: []
    };
}

export function updateNodeById(
    root: GroupNode,
    targetId: string,
    updater: (node: ConditionNode) => ConditionNode
): GroupNode {
    if (root.id === targetId) {
        return updater(root) as GroupNode;
    }

    return {
        ...root,
        children: root.children.map((child) => {
            if (child.type === "group") {
                return updateNodeById(child, targetId, updater);
            }

            if (child.id === targetId) {
                return updater(child);
            }

            return child;
        })
    };
}


export function insertChild(
    root: GroupNode,
    groupId: string,
    child: ConditionNode
): GroupNode {
    if (root.id === groupId) {
        return {
            ...root,
            children: [...root.children, child]
        };
    }

    return {
        ...root,
        children: root.children.map((c) =>
            c.type === "group"
                ? insertChild(c, groupId, child)
                : c
        )
    };
}


export function deleteNodeById(
    root: GroupNode,
    targetId: string
): GroupNode {
    if (root.id === targetId) {
        return { ...root, children: [] };
    }

    return {
        ...root,
        children: root.children
            .filter((child) => child.id !== targetId)
            .map((child) =>
                child.type === "group"
                    ? deleteNodeById(child, targetId)
                    : child
            )
    };
}
