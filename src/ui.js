// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from "react";
import ReactFlow, { Controls, Background, MiniMap } from "reactflow";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";
import { InputNode } from "./nodes/inputNode";
import { LLMNode } from "./nodes/llmNode";
import { OutputNode } from "./nodes/outputNode";
import { TextNode } from "./nodes/textNode";

import "reactflow/dist/style.css";

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});
export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setNodes,
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => {
    let nodeData = {
      id: nodeID,
      nodeType: `${type}`,
      onRemoveNode: (nodeId) => handleRemoveNode(nodeId), // Pass the remove handler
    };
    return nodeData;
  };

  const handleRemoveNode = useCallback(
    (nodeId) => {
      setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    },
    [setNodes]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData("application/reactflow")) {
        const appData = JSON.parse(
          event.dataTransfer.getData("application/reactflow")
        );
        const type = appData?.nodeType;

        if (typeof type === "undefined" || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, addNode, getNodeID]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const savePipeline = async (nodes, edges) => {
    try {
      const response = await fetch("http://localhost:5000/api/pipelines/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!response.ok) throw new Error("Failed to save pipeline");
      alert("Pipeline saved successfully!");
    } catch (error) {
      console.error("Save Error:", error);
    }
  };

  const loadPipeline = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/pipelines/load", {
        method: "GET",
      });
      if (!response.ok) throw new Error("Failed to load pipeline");
      const data = await response.json();
      return data; // Should return { nodes: [], edges: [] }
    } catch (error) {
      console.error("Load Error:", error);
      return { nodes: [], edges: [] }; // Fallback to empty
    }
  };

  return (
    <>
      <div ref={reactFlowWrapper} style={{ width: "100wv", height: "70vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          snapGrid={[gridSize, gridSize]}
          connectionLineType="smoothstep"
        >
          <Background color="#aaa" gap={gridSize} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => savePipeline(nodes, edges)}
          style={{ marginRight: "10px" }}
        >
          Save Pipeline
        </button>
        <button
          onClick={async () => {
            const { nodes: loadedNodes, edges: loadedEdges } =
              await loadPipeline();
            if (loadedNodes && loadedEdges) {
              onNodesChange(
                loadedNodes.map((node) => ({ type: "reset", item: node }))
              );
              onEdgesChange(
                loadedEdges.map((edge) => ({ type: "reset", item: edge }))
              );
            }
          }}
        >
          Load Pipeline
        </button>
      </div>
    </>
  );
};
