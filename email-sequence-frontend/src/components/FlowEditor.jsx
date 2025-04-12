import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
} from "reactflow"; // Add Panel to imports
import "reactflow/dist/style.css";
import axios from "axios";
import NodeTypeSelector from "./NodeTypeSelector";
import EmailNode from "./nodes/EmailNode";
import DelayNode from "./nodes/DelayNode";
import LeadSourceNode from "./nodes/LeadSourceNode";
import { FaSave, FaTrash } from "react-icons/fa";

// Define the node types for ReactFlow
const nodeTypes = {
  emailNode: EmailNode,
  delayNode: DelayNode,
  leadSourceNode: LeadSourceNode,
};

const FlowEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [name, setName] = useState("Untitled Sequence");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(id ? true : false);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]); // Add state for selected nodes

  // Load sequence data if editing an existing one
  useEffect(() => {
    if (id) {
      const fetchSequence = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            `http://localhost:5000/api/sequences/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setName(res.data.name);
          setNodes(res.data.flowData.nodes || []);
          setEdges(res.data.flowData.edges || []);
        } catch (err) {
          console.error(err);
          setError("Failed to load sequence");
        } finally {
          setIsLoading(false);
        }
      };

      fetchSequence();
    }
  }, [id, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: type },
      };

      // Set default data based on node type
      if (type === "emailNode") {
        newNode.data = {
          subject: "New Email",
          body: "Email content goes here...",
          recipient: "",
        };
      } else if (type === "delayNode") {
        newNode.data = {
          delay: 1,
          unit: "hours",
        };
      } else if (type === "leadSourceNode") {
        newNode.data = {
          source: "Website",
        };
      }

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const handleSave = async () => {
    setIsSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const flowData = {
        nodes,
        edges,
      };

      if (id) {
        // Update existing sequence
        await axios.put(
          `http://localhost:5000/api/sequences/${id}`,
          { name, flowData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new sequence
        await axios.post(
          "http://localhost:5000/api/sequences",
          { name, flowData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to save sequence");
    } finally {
      setIsSaving(false);
    }
  };

  const onSelectionChange = useCallback(({ nodes }) => {
    setSelectedNodes(nodes);
  }, []);

  const onDeleteNodes = useCallback(() => {
    if (selectedNodes.length === 0) return;

    setNodes((nds) =>
      nds.filter((node) => !selectedNodes.some((n) => n.id === node.id))
    );

    // Also delete any connected edges
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          !selectedNodes.some(
            (n) => n.id === edge.source || n.id === edge.target
          )
      )
    );
  }, [selectedNodes, setNodes, setEdges]);

  if (isLoading) {
    return <div className="text-center py-10">Loading sequence...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-blue">
      <div className="bg-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-b border-gray-300 text-xl font-semibold px-2 py-1 focus:outline-none focus:border-blue-500"
            placeholder="Sequence Name"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center gap-2"
        >
          <FaSave /> {isSaving ? "Saving..." : "Save Sequence"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      <div className="flex flex-1">
        <NodeTypeSelector />
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            onSelectionChange={onSelectionChange}
            multiSelectionKeyCode="Control"
            deleteKeyCode={null} // Disable default keyboard deletion
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />

            <Panel position="top-right" className="bg-white p-2 rounded shadow-md">
              <button
                onClick={onDeleteNodes}
                disabled={selectedNodes.length === 0}
                className={`flex items-center gap-2 px-3 py-2 rounded ${
                  selectedNodes.length === 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
                title="Delete selected nodes"
              >
                <FaTrash /> Delete{" "}
                {selectedNodes.length > 0 ? `(${selectedNodes.length})` : ""}
              </button>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default FlowEditor;
