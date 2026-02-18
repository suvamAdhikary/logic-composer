import type { GroupNode, ConditionNode } from "../../domain/types";

interface Props {
    root: GroupNode;
}

function validateTree(node: ConditionNode): boolean {
    if (node.type === "rule") {
        return node.value.trim() !== "";
    }

    return node.children.every(validateTree);
}

function JsonPreview({ root }: Props) {
    const isValid = validateTree(root);

    return (
        <div style={{ marginTop: "2rem" }}>
            <h3>JSON Output</h3>

            <button
                disabled={!isValid}
                onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(root, null, 2));
                    alert("Copied to clipboard");
                }}
            >
                Copy JSON
            </button>

            {!isValid && (
                <p style={{ color: "red" }}>
                    Fix empty rule values before exporting.
                </p>
            )}

            <pre
                style={{
                    background: "#111",
                    color: "#0f0",
                    padding: "1rem",
                    marginTop: "1rem",
                    overflow: "auto"
                }}
            >
                {JSON.stringify(root, null, 2)}
            </pre>
        </div>
    );
}

export default JsonPreview;
