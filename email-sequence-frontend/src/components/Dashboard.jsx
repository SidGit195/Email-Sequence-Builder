import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Dashboard = () => {
  const [sequences, setSequences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchSequences = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/sequences', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSequences(res.data);
      } catch (err) {
        console.log(err);
        setError('Failed to fetch sequences');
      } finally {
        setLoading(false);
      }
    };

    fetchSequences();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sequence?')) {
      setDeletingId(id);
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/sequences/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSequences(sequences.filter(seq => seq._id !== id));
      } catch (err) {
        console.error(err);
        const errorMessage = err.response?.data?.message || 'Failed to delete sequence';
        setError(errorMessage);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Email Sequences</h1>
        <Link 
          to="/editor" 
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center gap-2"
        >
          <FaPlus /> New Sequence
        </Link>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {sequences.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-4">You don't have any email sequences yet.</p>
          <Link to="/editor" className="text-blue-500 hover:text-blue-700 font-bold">
            Create your first sequence
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sequences.map((sequence) => (
            <div key={sequence._id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{sequence.name}</h3>
              <p className="text-gray-600 mb-2">Created: {new Date(sequence.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-600 mb-4">Nodes: {sequence.flowData.nodes.length}</p>
              <div className="flex justify-between">
                <Link 
                  to={`/editor/${sequence._id}`} 
                  className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded flex items-center gap-1"
                >
                  <FaEdit /> Edit
                </Link>
                <button 
                  onClick={() => handleDelete(sequence._id)} 
                  disabled={deletingId === sequence._id}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded flex items-center gap-1"
                >
                  {deletingId === sequence._id ? 'Deleting...' : <><FaTrash /> Delete</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;