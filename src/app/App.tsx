import { useState } from "react";
import type { GroupNode } from "../domain/types";
import ConditionBuilder from "../components/condition/ConditionBuilder";

function App() {
  const [root, setRoot] = useState<GroupNode>({
    id: "root",
    type: "group",
    operator: "AND",
    children: []
  });

  return (
    <>
      <div style={{ padding: "2rem" }}>
        <h1>Logic Composer</h1>
        <p style={{ color: "#555" }}>
          A visual rule builder for composing nested logical conditions.
        </p>

        <ConditionBuilder root={root} setRoot={setRoot} />
      </div>
    </>
  )
}

export default App
