import React from "react";
import { Handle } from "reactflow";

const BaseNode = ({ id, label, handles, children }) => {
  return (
    <div
      style={{
        width: 200,
        height: 80,
        border: "1px solid black",
        padding: "8px",
      }}
    >
      {handles?.map((handle, index) => (
        <Handle
          key={index}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          style={handle.style}
        />
      ))}
      <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
        <span>{label}</span>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default BaseNode;
