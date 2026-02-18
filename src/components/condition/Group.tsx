import type { GroupNode, ConditionNode } from "../../domain/types";
import {
    createRule,
    createGroup,
    insertChild,
    updateNodeById,
    deleteNodeById
} from "../../domain/treeUtils";
import Rule from "./Rule";

interface Props {
    node: GroupNode;
    root: GroupNode;
    setRoot: React.Dispatch<React.SetStateAction<GroupNode>>;
}


function Group({ node, root, setRoot }: Props) {
    // Change AND / OR
    const handleOperatorChange = (operator: "AND" | "OR") => {
        setRoot(
            updateNodeById(root, node.id, (n) => {
                if (n.type === "group") {
                    return { ...n, operator };
                }
                return n;
            }) as GroupNode
        );
    };

    // Add rule
    const handleAddRule = () => {
        setRoot(insertChild(root, node.id, createRule()) as GroupNode);
    };

    // Add nested group
    const handleAddGroup = () => {
        setRoot(insertChild(root, node.id, createGroup()) as GroupNode);
    };

    // Delete child node
    const handleDelete = (id: string) => {
        setRoot(deleteNodeById(root, id) as GroupNode);
    };

    return (
        <div style={{ border: "1px solid #ddd", padding: "1rem", marginTop: "1rem" }}>
            <div style={{ marginBottom: "0.5rem" }}>
                <strong>Group</strong>{" "}
                <select
                    value={node.operator}
                    onChange={(e) =>
                        handleOperatorChange(e.target.value as "AND" | "OR")
                    }
                >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                </select>
            </div>

            {/* Children */}
            <div style={{ marginLeft: "1rem" }}>
                {node.children.map((child: ConditionNode) => {
                    if (child.type === "rule") {
                        return (
                            <Rule
                                key={child.id}
                                node={child}
                                root={root}
                                setRoot={setRoot}
                                onDelete={handleDelete}
                            />
                        );
                    }

                    return (
                        <Group
                            key={child.id}
                            node={child}
                            root={root}
                            setRoot={setRoot}
                        />
                    );
                })}
            </div>

            {/* Controls */}
            <div style={{ marginTop: "0.5rem" }}>
                <button onClick={handleAddRule}>Add Rule</button>{" "}
                <button onClick={handleAddGroup}>Add Group</button>{" "}
                {node.id !== root.id && (
                    <button
                        onClick={() => setRoot(deleteNodeById(root, node.id))}
                        style={{ marginRight: 8 }}
                    >
                        Delete Group
                    </button>
                )}

            </div>
        </div>
    );
}

export default Group;
