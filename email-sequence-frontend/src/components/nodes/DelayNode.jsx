import { useState } from 'react';
import { Handle, Position } from 'reactflow';

const DelayNode = ({ data, selected, isConnectable }) => {
  const [nodeData, setNodeData] = useState({
    delay: data.delay || 1,
    unit: data.unit || 'hours',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...nodeData, [name]: value };
    setNodeData(updatedData);
    
    // Update the node data in the parent component
    data.delay = updatedData.delay;
    data.unit = updatedData.unit;
  };

  return (
    <div className={`border-2 ${selected ? 'border-yellow-500' : 'border-gray-300'} bg-white rounded-md p-3 shadow-md`}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      
      <div className="bg-yellow-100 -m-3 mb-2 p-2 rounded-t-md">
        <h3 className="font-bold text-yellow-800">Wait/Delay</h3>
      </div>
      
      <div className="mt-3 flex items-center gap-2">
        <label className="block text-xs font-medium text-gray-700">
          Wait for:
        </label>
        <input
          type="number"
          name="delay"
          value={nodeData.delay}
          onChange={handleChange}
          min="1"
          className="w-16 p-1 border border-gray-300 rounded text-sm"
        />
        <select
          name="unit"
          value={nodeData.unit}
          onChange={handleChange}
          className="p-1 border border-gray-300 rounded text-sm"
        >
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
          <option value="days">Days</option>
        </select>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default DelayNode;