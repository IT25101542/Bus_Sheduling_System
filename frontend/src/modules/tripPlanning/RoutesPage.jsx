import React, { useState, useEffect } from 'react';
import tripPlanningService from './tripPlanningService';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import { Plus, Edit2, Trash2, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    routeNumber: '',
    origin: '',
    destination: '',
    distanceKm: 100,
    estimatedDurationMins: 120,
    baseFare: 500,
    active: true
  });

  const loadRoutes = async () => {
    setLoading(true);
    try {
      const res = await tripPlanningService.getRoutes();
      setRoutes(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      routeNumber: 'RT-' + (10 + Math.floor(Math.random() * 89)),
      origin: '',
      destination: '',
      distanceKm: 120,
      estimatedDurationMins: 150,
      baseFare: 700,
      active: true
    });
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      routeNumber: item.routeNumber,
      origin: item.origin,
      destination: item.destination,
      distanceKm: item.distanceKm,
      estimatedDurationMins: item.estimatedDurationMins,
      baseFare: item.baseFare,
      active: item.active
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await tripPlanningService.updateRoute(editingId, formData);
        setSuccess('Route updated successfully!');
      } else {
        await tripPlanningService.createRoute(formData);
        setSuccess('New route created successfully!');
      }
      setIsModalOpen(false);
      loadRoutes();
      setTimeout(() => setSuccess(null), 3500);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await tripPlanningService.deleteRoute(id);
        setSuccess('Route deleted successfully.');
        loadRoutes();
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
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>Express & Intercity Bus Routes</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Configure transit corridors, mileage, duration estimates, and base pricing</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={16} /> Add New Route
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Route Number</th>
              <th>Origin Station</th>
              <th>Destination Station</th>
              <th>Distance</th>
              <th>Duration</th>
              <th>Base Fare</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>Loading routes...</td></tr>
            ) : routes.length === 0 ? (
              <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No routes configured. Click "Add New Route".</td></tr>
            ) : (
              routes.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700 }}>#{r.id}</td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#1e3a8a' }}>{r.routeNumber}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                      <MapPin size={14} color="#1e3a8a" /> {r.origin}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                      <MapPin size={14} color="#dc2626" /> {r.destination}
                    </div>
                  </td>
                  <td>{r.distanceKm} km</td>
                  <td>{Math.floor(r.estimatedDurationMins / 60)}h {r.estimatedDurationMins % 60}m</td>
                  <td style={{ fontWeight: 700, color: '#047857' }}>Rs. {r.baseFare?.toFixed(2)}</td>
                  <td>
                    <Badge status={r.active ? 'ACTIVE' : 'INACTIVE'} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button onClick={() => openEditModal(r)} className="btn btn-secondary btn-sm">
                        <Edit2 size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="btn btn-danger btn-sm">
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
        title={editingId ? `Edit Route (${formData.routeNumber})` : 'Add New Bus Route'}
      >
        {error && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Route Number *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. EX-05 or RT-12"
              value={formData.routeNumber}
              onChange={(e) => setFormData({ ...formData, routeNumber: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Origin *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Colombo (Fort)"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Destination *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Matara"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Distance (km) *</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                required
                value={formData.distanceKm}
                onChange={(e) => setFormData({ ...formData, distanceKm: parseFloat(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Est Duration (Minutes) *</label>
              <input
                type="number"
                className="form-input"
                required
                value={formData.estimatedDurationMins}
                onChange={(e) => setFormData({ ...formData, estimatedDurationMins: parseInt(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Base Fare (Rs.) *</label>
              <input
                type="number"
                step="10"
                className="form-input"
                required
                value={formData.baseFare}
                onChange={(e) => setFormData({ ...formData, baseFare: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Active Route</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Route' : 'Create Route'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RoutesPage;
