import { FaEnvelope, FaClock, FaUser } from 'react-icons/fa';

const NodeTypeSelector = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h2 className="text-lg font-bold mb-4">Node Types</h2>
      <div className="space-y-4">
        <div
          className="p-4 border border-gray-300 rounded bg-blue-50 cursor-grab flex items-center gap-3"
          onDragStart={(event) => onDragStart(event, 'emailNode')}
          draggable
        >
          <FaEnvelope className="text-blue-500" />
          <span>Cold Email</span>
        </div>
        <div
          className="p-4 border border-gray-300 rounded bg-yellow-50 cursor-grab flex items-center gap-3"
          onDragStart={(event) => onDragStart(event, 'delayNode')}
          draggable
        >
          <FaClock className="text-yellow-500" />
          <span>Wait/Delay</span>
        </div>
        <div
          className="p-4 border border-gray-300 rounded bg-green-50 cursor-grab flex items-center gap-3"
          onDragStart={(event) => onDragStart(event, 'leadSourceNode')}
          draggable
        >
          <FaUser className="text-green-500" />
          <span>Lead Source</span>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-md font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-1">
          <li>Drag node types onto the canvas</li>
          <li>Connect nodes by dragging from one handle to another</li>
          <li>Click on a node to edit its properties</li>
          <li>Save your sequence when finished</li>
        </ol>
      </div>
    </div>
  );
};

export default NodeTypeSelector;