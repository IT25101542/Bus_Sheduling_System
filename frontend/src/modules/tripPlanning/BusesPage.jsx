import React, { useState, useEffect } from 'react';
import tripPlanningService from './tripPlanningService';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import { Plus, Edit2, Trash2, Bus as BusIcon, CheckCircle2, AlertCircle } from 'lucide-react';

export const BusesPage = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    busNumber: '',
    registrationNumber: '',
    capacity: 40,
    busType: 'LUXURY_AC',
    status: 'ACTIVE',
    depotLocation: 'Colombo Fort Central Depot',
    airConditioned: true
  });

  const loadBuses = async () => {
    setLoading(true);
    try {
      const res = await tripPlanningService.getBuses();
      setBuses(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuses();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      busNumber: 'BUS-0' + (10 + Math.floor(Math.random() * 89)),
      registrationNumber: 'ND-' + (1000 + Math.floor(Math.random() * 8999)),
      capacity: 40,
      busType: 'LUXURY_AC',
      status: 'ACTIVE',
      depotLocation: 'Colombo Fort Central Depot',
      airConditioned: true
    });
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      busNumber: item.busNumber,
      registrationNumber: item.registrationNumber,
      capacity: item.capacity,
      busType: item.busType,
      status: item.status,
      depotLocation: item.depotLocation,
      airConditioned: item.airConditioned
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await tripPlanningService.updateBus(editingId, formData);
        setSuccess('Bus record updated successfully!');
      } else {
        await tripPlanningService.createBus(formData);
        setSuccess('New bus registered to fleet successfully!');
      }
      setIsModalOpen(false);
      loadBuses();
      setTimeout(() => setSuccess(null), 3500);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bus record?')) {
      try {
        await tripPlanningService.deleteBus(id);
        setSuccess('Bus deleted successfully.');
        loadBuses();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      {success && (
        <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} /> {success}
        </div>
      )}

      {error && !isModalOpen && (
        <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.25rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>Transit Fleet Roster</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Manage physical bus vehicles, seat capacities, technical category, and maintenance readiness</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={16} /> Register New Bus
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Bus Number</th>
              <th>License Plate</th>
              <th>Class / Type</th>
              <th>Seats</th>
              <th>Depot Location</th>
              <th>Climate</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>Loading fleet...</td></tr>
            ) : buses.length === 0 ? (
              <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No buses registered. Click "Register New Bus".</td></tr>
            ) : (
              buses.map((b) => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 700 }}>#{b.id}</td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#1e3a8a' }}>{b.busNumber}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {b.registrationNumber}
                    </span>
                  </td>
                  <td>
                    <Badge status={b.busType?.replace('_', ' ')} type="primary" />
                  </td>
                  <td style={{ fontWeight: 700 }}>{b.capacity} Seats</td>
                  <td>{b.depotLocation}</td>
                  <td>{b.airConditioned ? '❄️ AC' : 'Non-AC'}</td>
                  <td>
                    <Badge status={b.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button onClick={() => openEditModal(b)} className="btn btn-secondary btn-sm">
                        <Edit2 size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(b.id)} className="btn btn-danger btn-sm">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? `Edit Bus (${formData.busNumber})` : 'Register New Bus to Fleet'}
      >
        {error && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Bus Identifier *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. BUS-006"
                value={formData.busNumber}
                onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Registration No (Plate) *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. ND-8899"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Bus Type / Category</label>
              <select
                className="form-select"
                value={formData.busType}
                onChange={(e) => setFormData({ ...formData, busType: e.target.value })}
              >
                <option value="LUXURY_AC">Luxury AC</option>
                <option value="HIGHWAY_EXPRESS">Highway Express</option>
                <option value="SEMI_LUXURY">Semi-Luxury</option>
                <option value="STANDARD">Standard Service</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Passenger Capacity (Seats) *</label>
              <input
                type="number"
                min="10"
                max="60"
                className="form-input"
                required
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Operational Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="ACTIVE">Active (In Service)</option>
                <option value="MAINTENANCE">Under Maintenance</option>
                <option value="INACTIVE">Decommissioned</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Home Depot Location</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.depotLocation}
                onChange={(e) => setFormData({ ...formData, depotLocation: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.airConditioned}
                onChange={(e) => setFormData({ ...formData, airConditioned: e.target.checked })}
              />
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Equipped with Air Conditioning</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Save Changes' : 'Register Bus'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BusesPage;
