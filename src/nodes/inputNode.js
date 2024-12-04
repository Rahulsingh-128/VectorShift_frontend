import React, { useState } from "react";
import BaseNode from "../Component/BaseNode";
import { Position } from "reactflow";

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || `input_${id}`);
  const [inputType, setInputType] = useState(data.inputType || "Text");

  return (
    <BaseNode
      id={id}
      label="Input"
      handles={[
        { type: "source", position: Position.Right, id: `${id}-value` },
      ]}
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
          value={inputType}
          onChange={(e) => setInputType(e.target.value)}
        >
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </label>
    </BaseNode>
  );
};
