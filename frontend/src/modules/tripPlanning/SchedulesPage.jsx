import React, { useState, useEffect } from 'react';
import tripPlanningService from './tripPlanningService';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import { Plus, Edit2, Trash2, Calendar, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export const SchedulesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    scheduleCode: '',
    routeId: '',
    busId: '',
    driverId: '',
    departureTime: '07:00',
    arrivalTime: '08:30',
    frequency: 'DAILY',
    status: 'ACTIVE',
    effectiveFrom: new Date().toISOString().split('T')[0],
    effectiveTo: '2026-12-31'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [schedRes, routesRes, busesRes, driversRes] = await Promise.all([
        tripPlanningService.getSchedules(),
        tripPlanningService.getRoutes(),
        tripPlanningService.getBuses(),
        tripPlanningService.getDrivers(),
      ]);
      setSchedules(schedRes.data || []);
      setRoutes(routesRes.data || []);
      setBuses(busesRes.data || []);
      setDrivers(driversRes.data || []);
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
    setEditingId(null);
    setFormData({
      scheduleCode: 'SCH-EX' + (100 + Math.floor(Math.random() * 899)),
      routeId: routes[0]?.id || '',
      busId: buses[0]?.id || '',
      driverId: drivers[0]?.id || '',
      departureTime: '08:00',
      arrivalTime: '10:00',
      frequency: 'DAILY',
      status: 'ACTIVE',
      effectiveFrom: new Date().toISOString().split('T')[0],
      effectiveTo: '2026-12-31'
    });
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      scheduleCode: item.scheduleCode,
      routeId: item.routeId,
      busId: item.busId,
      driverId: item.driverId,
      departureTime: item.departureTime,
      arrivalTime: item.arrivalTime,
      frequency: item.frequency,
      status: item.status,
      effectiveFrom: item.effectiveFrom || '',
      effectiveTo: item.effectiveTo || ''
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await tripPlanningService.updateSchedule(editingId, formData);
        setSuccess('Schedule updated successfully!');
      } else {
        await tripPlanningService.createSchedule(formData);
        setSuccess('New schedule created successfully!');
      }
      setIsModalOpen(false);
      loadData();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bus schedule?')) {
      try {
        await tripPlanningService.deleteSchedule(id);
        setSuccess('Schedule deleted successfully.');
        loadData();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      {/* VIVA MODULE HEADER */}
      {/* BUSINESS RULE ALERT */}
      <div style={{
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '8px',
        padding: '0.875rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.85rem',
        color: '#1e40af'
      }}>
        <AlertTriangle size={20} color="#2563eb" style={{ flexShrink: 0 }} />
        <div>
          <strong>System Conflict Prevention Rule:</strong> Buses and drivers cannot be assigned to overlapping active trips. The system automatically detects and prevents scheduling conflicts upon submission.
        </div>
      </div>

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

      {/* ACTION BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>Active Bus Schedules</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Showing all scheduled route timetables and resource allocations</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={16} /> Create Schedule
        </button>
      </div>

      {/* DATA TABLE (READ, UPDATE, DELETE) */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Route</th>
              <th>Assigned Bus</th>
              <th>Assigned Driver</th>
              <th>Time Window</th>
              <th>Frequency</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>Loading schedules...</td></tr>
            ) : schedules.length === 0 ? (
              <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No schedules found. Click "Create Schedule" above.</td></tr>
            ) : (
              schedules.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 700 }}>#{item.id}</td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#1e3a8a' }}>{item.scheduleCode}</span>
                  </td>
                  <td>{item.routeName}</td>
                  <td>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.busNumber}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem' }}>{item.driverName}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>
                      {item.departureTime} → {item.arrivalTime}
                    </span>
                  </td>
                  <td>{item.frequency}</td>
                  <td>
                    <Badge status={item.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button onClick={() => openEditModal(item)} className="btn btn-secondary btn-sm" title="Edit Schedule">
                        <Edit2 size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm" title="Delete Schedule">
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

      {/* CREATE / EDIT SCHEDULE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? `Edit Schedule (${formData.scheduleCode})` : 'Create New Bus Schedule'}
      >
        {error && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            <AlertTriangle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.4rem' }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Schedule Code *</label>
            <input
              type="text"
              className="form-input"
              required
              value={formData.scheduleCode}
              onChange={(e) => setFormData({ ...formData, scheduleCode: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Select Route *</label>
            <select
              className="form-select"
              required
              value={formData.routeId}
              onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
            >
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.routeNumber} ({r.origin} → {r.destination}) - {r.distanceKm} km
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Assign Bus *</label>
              <select
                className="form-select"
                required
                value={formData.busId}
                onChange={(e) => setFormData({ ...formData, busId: e.target.value })}
              >
                {buses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.busNumber} [{b.registrationNumber}] - {b.busType} ({b.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assign Driver *</label>
              <select
                className="form-select"
                required
                value={formData.driverId}
                onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
              >
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.fullName} ({d.driverCode}) - {d.status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Departure Time (HH:mm) *</label>
              <input
                type="time"
                className="form-input"
                required
                value={formData.departureTime}
                onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Arrival Time (HH:mm) *</label>
              <input
                type="time"
                className="form-input"
                required
                value={formData.arrivalTime}
                onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Frequency</label>
              <select
                className="form-select"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKDAYS">Weekdays Only</option>
                <option value="WEEKENDS">Weekends Only</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Save Changes' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SchedulesPage;
