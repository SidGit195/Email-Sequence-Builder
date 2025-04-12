import { useState } from 'react';
import { Handle, Position } from 'reactflow';

const LeadSourceNode = ({ data, selected, isConnectable }) => {
  const [nodeData, setNodeData] = useState({
    source: data.source || 'Website',
  });

  const handleChange = (e) => {
    const source = e.target.value;
    setNodeData({ source });
    data.source = source; // Update parent data
  };

  return (
    <div className={`border-2 ${selected ? 'border-green-500' : 'border-gray-300'} bg-white rounded-md p-3 shadow-md`}>
      <div className="bg-green-100 -m-3 mb-2 p-2 rounded-t-md">
        <h3 className="font-bold text-green-800">Lead Source</h3>
      </div>
      
      <div className="mt-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Source:
        </label>
        <select
          value={nodeData.source}
          onChange={handleChange}
          className="w-full p-1 border border-gray-300 rounded text-sm"
        >
          <option value="Website">Website</option>
          <option value="Social Media">Social Media</option>
          <option value="Referral">Referral</option>
          <option value="Event">Event</option>
          <option value="Cold Call">Cold Call</option>
          <option value="Other">Other</option>
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

export default LeadSourceNode;