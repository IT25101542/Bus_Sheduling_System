import React, { useState, useEffect } from 'react';
import loyaltyService from './loyaltyService';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import { Award, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const RewardProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState({
    programName: '',
    minPoints: 100,
    pointMultiplier: 1.0,
    discountPercentage: 5.0,
    description: '',
    active: true
  });

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const res = await loyaltyService.getAllPrograms();
      setPrograms(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProgram(null);
    setFormData({
      programName: '',
      minPoints: 100,
      pointMultiplier: 1.0,
      discountPercentage: 5.0,
      description: '',
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prog) => {
    setEditingProgram(prog);
    setFormData({
      programName: prog.programName,
      minPoints: prog.minPoints,
      pointMultiplier: prog.pointMultiplier,
      discountPercentage: prog.discountPercentage,
      description: prog.description || '',
      active: prog.active
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        ...formData,
        minPoints: parseInt(formData.minPoints, 10),
        pointMultiplier: parseFloat(formData.pointMultiplier),
        discountPercentage: parseFloat(formData.discountPercentage)
      };

      if (editingProgram) {
        await loyaltyService.updateProgram(editingProgram.id, payload);
        setSuccess('Reward program tier updated successfully!');
      } else {
        await loyaltyService.createProgram(payload);
        setSuccess('New reward tier created successfully!');
      }
      setIsModalOpen(false);
      loadPrograms();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate or remove this loyalty tier?')) {
      try {
        await loyaltyService.deleteProgram(id);
        setSuccess('Program deleted.');
        loadPrograms();
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

      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>Loyalty Tiers & Benefit Schemes</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Configure frequent-traveler membership levels, point earning multipliers, and fare concession perks.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleOpenCreateModal}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> Add New Tier
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading reward tiers...</div>
        ) : programs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No reward programs configured.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tier Name</th>
                  <th>Min Points Required</th>
                  <th>Earn Multiplier</th>
                  <th>Ticket Discount</th>
                  <th>Perks Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((prog) => (
                  <tr key={prog.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                        <Award size={18} color="var(--secondary-color)" />
                        {prog.programName}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{prog.minPoints} pts</span>
                    </td>
                    <td>
                      <span className="badge badge-info">{prog.pointMultiplier}x Points</span>
                    </td>
                    <td>
                      <span style={{ color: '#059669', fontWeight: 700 }}>{prog.discountPercentage}% OFF</span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '300px' }}>
                      {prog.description || 'Standard benefits'}
                    </td>
                    <td>
                      <Badge variant={prog.active ? 'success' : 'neutral'}>
                        {prog.active ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          onClick={() => handleOpenEditModal(prog)}
                          title="Edit Tier"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#DC2626', borderColor: '#FECACA' }}
                          onClick={() => handleDelete(prog.id)}
                          title="Delete Tier"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Program Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProgram ? 'Edit Reward Program' : 'Create Reward Program Tier'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tier Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.programName}
              onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
              required
              placeholder="e.g. Platinum Traveler"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Min Points</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={formData.minPoints}
                onChange={(e) => setFormData({ ...formData, minPoints: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Points Multiplier</label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                className="form-control"
                value={formData.pointMultiplier}
                onChange={(e) => setFormData({ ...formData, pointMultiplier: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Discount %</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                className="form-control"
                value={formData.discountPercentage}
                onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Perks & Description</label>
            <textarea
              className="form-control"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe VIP lounge access, priority seat selection, free refreshments..."
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
              <span style={{ fontWeight: 500 }}>Active Program</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingProgram ? 'Save Changes' : 'Create Tier'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RewardProgramsPage;
