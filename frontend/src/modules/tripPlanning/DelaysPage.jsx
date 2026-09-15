import React, { useState, useEffect } from 'react';
import tripPlanningService from './tripPlanningService';
import Modal from '../../components/Modal';
import { Plus, Trash2, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export const DelaysPage = () => {
  const [delays, setDelays] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    scheduleId: '',
    delayMinutes: 15,
    delayReason: '',
    updatedDepartureTime: '',
    reportedBy: 'Depot Supervisor'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [delRes, schedRes] = await Promise.all([
        tripPlanningService.getDelays(),
        tripPlanningService.getSchedules()
      ]);
      setDelays(delRes.data || []);
      setSchedules(schedRes.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setFormData({
      scheduleId: schedules[0]?.id || '',
      delayMinutes: 15,
      delayReason: 'Luggage loading delay at terminal platform',
      updatedDepartureTime: '07:15',
      reportedBy: 'Depot Supervisor'
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await tripPlanningService.logDelay(formData);
      setSuccess('Trip delay recorded successfully!');
      setIsModalOpen(false);
      loadData();
      setTimeout(() => setSuccess(null), 3500);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this delay record?')) {
      try {
        await tripPlanningService.deleteDelay(id);
        setSuccess('Delay record removed.');
        loadData();
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>Logged Trip Delays</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Real-time departure tracking, incident reasons, and updated departure timelines</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={16} /> Log Trip Delay
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Schedule Code</th>
              <th>Route Corridor</th>
              <th>Delay Time</th>
              <th>Incident Reason</th>
              <th>Updated Departure</th>
              <th>Reported By</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Loading delay logs...</td></tr>
            ) : delays.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No delays logged. All scheduled trips are on time!</td></tr>
            ) : (
              delays.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 700 }}>#{d.id}</td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#1e3a8a' }}>{d.scheduleCode}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{d.routeName}</td>
                  <td>
                    <span style={{
                      backgroundColor: '#fef2f2', color: '#dc2626',
                      padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.85rem'
                    }}>
                      +{d.delayMinutes} Mins
                    </span>
                  </td>
                  <td>{d.delayReason}</td>
                  <td style={{ fontWeight: 700, color: '#b45309' }}>{d.updatedDepartureTime || 'TBD'}</td>
                  <td>{d.reportedBy}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => handleDelete(d.id)} className="btn btn-danger btn-sm">
                      <Trash2 size={14} /> Delete
                    </button>
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
        title="Log Schedule Delay & Disruption"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Scheduled Trip *</label>
            <select
              className="form-select"
              required
              value={formData.scheduleId}
              onChange={(e) => setFormData({ ...formData, scheduleId: e.target.value })}
            >
              {schedules.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.scheduleCode} - {s.routeName} (Scheduled: {s.departureTime})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Delay in Minutes *</label>
              <input
                type="number"
                min="1"
                className="form-input"
                required
                value={formData.delayMinutes}
                onChange={(e) => setFormData({ ...formData, delayMinutes: parseInt(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Updated Estimated Departure</label>
              <input
                type="time"
                className="form-input"
                value={formData.updatedDepartureTime}
                onChange={(e) => setFormData({ ...formData, updatedDepartureTime: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Delay Reason / Cause *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Express highway traffic congestion / Engine pre-check"
              value={formData.delayReason}
              onChange={(e) => setFormData({ ...formData, delayReason: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Reported By</label>
            <input
              type="text"
              className="form-input"
              value={formData.reportedBy}
              onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Record Delay
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DelaysPage;
