import React, { useState, useEffect } from 'react';
import { getAllMerchants, createMerchant, updateMerchant, deleteMerchant } from '../../services/MerchantService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MerchantManagement() {
  // State variables
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    description: ''
  });

  // Load merchants when component mounts
  useEffect(() => {
    loadMerchants();
  }, []);

  // Function to load merchants
  const loadMerchants = async () => {
    setLoading(true);
    try {
      const data = await getAllMerchants();
      setMerchants(data);
    } catch (error) {
      toast.error('Failed to load merchants: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingMerchant) {
        await updateMerchant(editingMerchant.id, formData);
        toast.success('Merchant updated successfully');
      } else {
        await createMerchant(formData);
        toast.success('Merchant created successfully');
      }
      resetForm();
      loadMerchants();
    } catch (error) {
      toast.error(`Failed to ${editingMerchant ? 'update' : 'create'} merchant: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit merchant
  const handleEdit = (merchant) => {
    setEditingMerchant(merchant);
    setFormData({
      name: merchant.name,
      email: merchant.email,
      phone: merchant.phone || '',
      address: merchant.address || '',
      description: merchant.description || ''
    });
    setIsFormVisible(true);
  };

  // Handle delete merchant
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this merchant?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteMerchant(id);
      toast.success('Merchant deleted successfully');
      loadMerchants();
    } catch (error) {
      toast.error('Failed to delete merchant: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      description: ''
    });
    setEditingMerchant(null);
    setIsFormVisible(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Merchant Management</h2>
        <button 
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isFormVisible ? 'Cancel' : 'Add New Merchant'}
        </button>
      </div>
      
      {/* Merchant Form */}
      {isFormVisible && (
        <div className="bg-white p-4 mb-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">
            {editingMerchant ? 'Edit Merchant' : 'Add New Merchant'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows="3"
                ></textarea>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 mr-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Saving...' : editingMerchant ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Merchants List */}
      <div className="bg-white rounded shadow">
        {loading && !isFormVisible && (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading merchants...</p>
          </div>
        )}
        
        {!loading && merchants.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No merchants found.</p>
          </div>
        )}
        
        {merchants.length > 0 && (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {merchants.map(merchant => (
                <tr key={merchant.id} className="border-t">
                  <td className="p-3">{merchant.name}</td>
                  <td className="p-3">{merchant.email}</td>
                  <td className="p-3">{merchant.phone || 'N/A'}</td>
                  <td className="p-3 flex space-x-2">
                    <button
                      onClick={() => handleEdit(merchant)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(merchant.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MerchantManagement;