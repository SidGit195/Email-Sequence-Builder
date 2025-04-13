import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Dashboard = () => {
  const [sequences, setSequences] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchSequences = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/sequences`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Make sure we're setting an array
        setSequences(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching sequences:', err);
        setError('Failed to load sequences');
        setSequences([]); // Set to empty array on error
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
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/sequences/${id}`, {
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Email Sequences</h1>

      {loading ? (
        <p>Loading sequences...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(sequences) && sequences.length > 0 ? (
            sequences.map((sequence) => (
              <div key={sequence._id} className="border p-4 rounded shadow">
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
            ))
          ) : (
            <p>No sequences found. Create your first one!</p>
          )}
        </div>
      )}

      <div className="flex justify-between items-center mt-6">
        <Link
          to="/editor"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center gap-2"
        >
          <FaPlus /> New Sequence
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;