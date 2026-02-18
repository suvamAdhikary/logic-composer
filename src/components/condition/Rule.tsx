import type { RuleNode, GroupNode } from "../../domain/types";
import { updateNodeById } from "../../domain/treeUtils";

interface Props {
    node: RuleNode;
    root: GroupNode;
    setRoot: React.Dispatch<React.SetStateAction<GroupNode>>;
    onDelete: (id: string) => void;
}

function Rule({ node, root, setRoot, onDelete }: Props) {
    const handleFieldChange = (field: RuleNode["field"]) => {
        setRoot(
            updateNodeById(root, node.id, (n) => {
                if (n.type === "rule") {
                    return { ...n, field };
                }
                return n;
            })
        );
    };

    const handleOperatorChange = (operator: RuleNode["operator"]) => {
        setRoot(
            updateNodeById(root, node.id, (n) => {
                if (n.type === "rule") {
                    return { ...n, operator };
                }
                return n;
            })
        );
    };

    const handleValueChange = (value: string) => {
        setRoot(
            updateNodeById(root, node.id, (n) => {
                if (n.type === "rule") {
                    return { ...n, value };
                }
                return n;
            })
        );
    };

    const isInvalid = node.value.trim() === "";

    return (
        <div
            style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                marginBottom: "0.5rem"
            }}
        >
            <select
                value={node.field}
                onChange={(e) =>
                    handleFieldChange(e.target.value as RuleNode["field"])
                }
            >
                <option value="Price">Price</option>
                <option value="Category">Category</option>
                <option value="Rating">Rating</option>
            </select>

            <select
                value={node.operator}
                onChange={(e) =>
                    handleOperatorChange(e.target.value as RuleNode["operator"])
                }
            >
                <option value=">">{">"}</option>
                <option value="<">{"<"}</option>
                <option value="=">{"="}</option>
                <option value="!=">{"!="}</option>
                <option value=">=">{">="}</option>
                <option value="<=">{"<="}</option>
                <option value="contains">contains</option>
            </select>

            <input
                type="text"
                value={node.value}
                onChange={(e) => handleValueChange(e.target.value)}
                style={{
                    border: isInvalid ? "1px solid red" : "1px solid #ccc"
                }}
            />

            <button onClick={() => onDelete(node.id)}>Delete</button>
        </div>
    );
}

export default Rule;
