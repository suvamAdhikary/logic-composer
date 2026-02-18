import type { GroupNode } from "../../domain/types";
import Group from "./Group";
import JsonPreview from "./JsonPreview";

interface Props {
    root: GroupNode;
    setRoot: React.Dispatch<React.SetStateAction<GroupNode>>;
}

function ConditionBuilder({ root, setRoot }: Props) {
    return (
        <div>
            <Group node={root} root={root} setRoot={setRoot} />

            <JsonPreview root={root} />
        </div>
    );
}

export default ConditionBuilder;
