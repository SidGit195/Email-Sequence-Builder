import { useState } from 'react';
import { Handle, Position } from 'reactflow';

const EmailNode = ({ data, selected, isConnectable }) => {
  const [nodeData, setNodeData] = useState({
    subject: data.subject || 'New Email',
    body: data.body || 'Email content goes here...',
    recipient: data.recipient || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...nodeData, [name]: value };
    setNodeData(updatedData);
    
    // Update the node data in the parent component
    data.subject = updatedData.subject;
    data.body = updatedData.body;
    data.recipient = updatedData.recipient;
  };

  return (
    <div className={`border-2 ${selected ? 'border-blue-500' : 'border-gray-300'} bg-white rounded-md p-3 shadow-md`}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      
      <div className="bg-blue-100 -m-3 mb-2 p-2 rounded-t-md">
        <h3 className="font-bold text-blue-800">Cold Email</h3>
      </div>
      
      <div className="mt-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Recipient Email:
        </label>
        <input
          type="email"
          name="recipient"
          value={nodeData.recipient}
          onChange={handleChange}
          className="w-full p-1 border border-gray-300 rounded text-sm"
          placeholder="recipient@example.com"
        />
      </div>
      
      <div className="mt-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Subject:
        </label>
        <input
          type="text"
          name="subject"
          value={nodeData.subject}
          onChange={handleChange}
          className="w-full p-1 border border-gray-300 rounded text-sm"
        />
      </div>
      
      <div className="mt-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Email Body:
        </label>
        <textarea
          name="body"
          value={nodeData.body}
          onChange={handleChange}
          className="w-full p-1 border border-gray-300 rounded text-sm"
          rows={3}
        />
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default EmailNode;