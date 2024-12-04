import { Handle, Position } from "reactflow";
import { useStore } from "../store";
import { useState } from "react";
import { nodeStyles } from "../styles/nodesStyles";

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || "{{input}}");
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleTextChange = (e) => {
    const updatedText = e.target.value;
    setCurrText(updatedText);
    updateNodeField(id, "text", updatedText);
  };

  return (
    <div style={nodeStyles.base}>
      <div style={nodeStyles.header}>
        <span>Text</span>
      </div>
      <div>
        <label style={nodeStyles.label}>
          Text:
          <input
            type="text"
            value={currText}
            onChange={handleTextChange}
            style={nodeStyles.input}
          />
        </label>
      </div>
      <Handle type="source" position={Position.Right} id={`${id}-output`} />
    </div>
  );
};
