import React, { useState, useEffect } from 'react';
import tripPlanningService from './tripPlanningService';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import { Plus, Edit2, Trash2, UserCheck, CheckCircle2, Phone } from 'lucide-react';

export const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    driverCode: '',
    fullName: '',
    licenseNumber: '',
    phone: '',
    status: 'AVAILABLE',
    assignedDepot: 'Colombo Fort Central Depot'
  });

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const res = await tripPlanningService.getDrivers();
      setDrivers(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      driverCode: 'DRV-0' + (10 + Math.floor(Math.random() * 89)),
      fullName: '',
      licenseNumber: 'B' + (1000000 + Math.floor(Math.random() * 8999999)),
      phone: '+94 77 123 4567',
      status: 'AVAILABLE',
      assignedDepot: 'Colombo Fort Central Depot'
    });
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      driverCode: item.driverCode,
      fullName: item.fullName,
      licenseNumber: item.licenseNumber,
      phone: item.phone,
      status: item.status,
      assignedDepot: item.assignedDepot
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await tripPlanningService.updateDriver(editingId, formData);
        setSuccess('Driver details updated!');
      } else {
        await tripPlanningService.createDriver(formData);
        setSuccess('Driver registered successfully!');
      }
      setIsModalOpen(false);
      loadDrivers();
      setTimeout(() => setSuccess(null), 3500);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this driver?')) {
      try {
        await tripPlanningService.deleteDriver(id);
        setSuccess('Driver removed successfully.');
        loadDrivers();
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
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>Drivers Roster</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Manage certified drivers, commercial licenses, contact details, and duty status</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={16} /> Register New Driver
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Driver Code</th>
              <th>Full Name</th>
              <th>Commercial License</th>
              <th>Phone Number</th>
              <th>Assigned Depot</th>
              <th>Duty Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Loading drivers...</td></tr>
            ) : drivers.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No drivers found. Click "Register New Driver".</td></tr>
            ) : (
              drivers.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 700 }}>#{d.id}</td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#1e3a8a' }}>{d.driverCode}</span>
                  </td>
                  <td style={{ fontWeight: 700 }}>{d.fullName}</td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{d.licenseNumber}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Phone size={14} color="#64748b" /> {d.phone}
                    </div>
                  </td>
                  <td>{d.assignedDepot}</td>
                  <td>
                    <Badge status={d.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button onClick={() => openEditModal(d)} className="btn btn-secondary btn-sm">
                        <Edit2 size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(d.id)} className="btn btn-danger btn-sm">
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
        title={editingId ? `Edit Driver (${formData.driverCode})` : 'Register Certified Driver'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Driver Code *</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.driverCode}
                onChange={(e) => setFormData({ ...formData, driverCode: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Sunil Wickramasinghe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Commercial License No *</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Phone *</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Duty Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="AVAILABLE">Available for Assignment</option>
                <option value="ON_TRIP">Currently on Trip</option>
                <option value="ON_LEAVE">On Scheduled Leave</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Assigned Depot</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.assignedDepot}
                onChange={(e) => setFormData({ ...formData, assignedDepot: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Save Changes' : 'Register Driver'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DriversPage;
