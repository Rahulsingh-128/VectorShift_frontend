import React, { useState } from "react";
import { Position } from "reactflow";
import BaseNode from "../Component/BaseNode";

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || `output_${id}`);
  const [outputType, setOutputType] = useState(data.outputType || "Text");

  return (
    <BaseNode
      id={id}
      label="Output"
      handles={[{ type: "target", position: Position.Left, id: `${id}-value` }]}
    >
      <label>
        Name:
        <input
          type="text"
          value={currName}
          onChange={(e) => setCurrName(e.target.value)}
        />
      </label>
      <label>
        Type:
        <select
          value={outputType}
          onChange={(e) => setOutputType(e.target.value)}
        >
          <option value="Text">Text</option>
          <option value="File">Image</option>
        </select>
      </label>
    </BaseNode>
  );
};
