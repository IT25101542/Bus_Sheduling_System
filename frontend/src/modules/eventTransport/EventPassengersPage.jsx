import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import eventTransportService from './eventTransportService';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import { Users, UserPlus, CheckSquare, Square, Trash2, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';

export const EventPassengersPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialEventId = searchParams.get('eventId') || '';

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(initialEventId);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Add Passenger Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    passengerName: '',
    contactPhone: '',
    emergencyContact: '',
    seatAllocated: 'A1',
    busNumber: 'ND-8899'
  });

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const res = await eventTransportService.getAllEvents();
      const evList = res.data || [];
      setEvents(evList);

      const activeId = selectedEventId || (evList.length > 0 ? evList[0].id.toString() : '');
      setSelectedEventId(activeId);
      if (activeId) {
        loadPassengers(activeId);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPassengers = async (eId) => {
    try {
      const res = await eventTransportService.getPassengersByEvent(eId);
      setPassengers(res.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleEventChange = (eId) => {
    setSelectedEventId(eId);
    loadPassengers(eId);
  };

  const handleToggleCheckIn = async (passengerId) => {
    try {
      await eventTransportService.toggleCheckIn(passengerId);
      loadPassengers(selectedEventId);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemovePassenger = async (passengerId) => {
    if (window.confirm('Remove this passenger from the event manifest?')) {
      try {
        await eventTransportService.removePassenger(passengerId);
        setSuccess('Passenger removed.');
        loadPassengers(selectedEventId);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSubmitPassenger = async (e) => {
    e.preventDefault();
    if (!selectedEventId) return;
    setError(null);
    try {
      await eventTransportService.registerPassenger(selectedEventId, {
        ...formData,
        eventId: parseInt(selectedEventId, 10)
      });
      setSuccess('Passenger registered to manifest successfully!');
      setIsModalOpen(false);
      setFormData({
        passengerName: '',
        contactPhone: '',
        emergencyContact: '',
        seatAllocated: 'A1',
        busNumber: 'ND-8899'
      });
      loadPassengers(selectedEventId);
    } catch (err) {
      setError(err.message);
    }
  };

  const checkedInCount = passengers.filter(p => p.checkInStatus).length;

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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>Passenger Manifest & Gate Control</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Boarding manifests, emergency contact tracing, and live gate check-in verification.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select
            className="form-control"
            value={selectedEventId}
            onChange={(e) => handleEventChange(e.target.value)}
            style={{ minWidth: '220px' }}
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.eventName}
              </option>
            ))}
          </select>

          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
            disabled={!selectedEventId}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <UserPlus size={18} /> Add Passenger
          </button>
        </div>
      </div>

      {/* Manifest Summary Bar */}
      <div
        style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manifest Status: </span>
          <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>
            {checkedInCount} / {passengers.length} Checked In
          </strong>
        </div>
        <div style={{ minWidth: '200px' }}>
          <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${passengers.length > 0 ? (checkedInCount / passengers.length) * 100 : 0}%`,
                height: '100%',
                backgroundColor: '#10B981',
                transition: 'width 0.3s ease'
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading manifest...</div>
        ) : passengers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Users size={48} style={{ margin: '0 auto 1rem', color: '#CBD5E1' }} />
            <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-main)' }}>No passengers registered yet</p>
            <p>Add participants or import group lists to generate the official departure manifest.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Gate Check-in</th>
                  <th>Passenger Name</th>
                  <th>Contact Phone</th>
                  <th>Emergency Contact</th>
                  <th>Assigned Coach</th>
                  <th>Seat #</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {passengers.map((p) => (
                  <tr key={p.id} style={{ backgroundColor: p.checkInStatus ? '#F0FDF4' : 'inherit' }}>
                    <td>
                      <button
                        onClick={() => handleToggleCheckIn(p.id)}
                        className={`btn ${p.checkInStatus ? 'btn-secondary' : 'btn-outline'}`}
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        {p.checkInStatus ? (
                          <>
                            <CheckSquare size={16} /> Boarded
                          </>
                        ) : (
                          <>
                            <Square size={16} /> Check In
                          </>
                        )}
                      </button>
                    </td>
                    <td style={{ fontWeight: 600 }}>{p.passengerName}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                        <Phone size={12} color="var(--text-muted)" />
                        {p.contactPhone}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {p.emergencyContact || 'None listed'}
                    </td>
                    <td>
                      <span className="badge badge-info">{p.busNumber || 'Assigned Bus'}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>
                        {p.seatAllocated || 'Any'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#DC2626', borderColor: '#FECACA' }}
                        onClick={() => handleRemovePassenger(p.id)}
                        title="Remove Passenger"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Passenger Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Passenger to Event Manifest"
      >
        <form onSubmit={handleSubmitPassenger}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.passengerName}
              onChange={(e) => setFormData({ ...formData, passengerName: e.target.value })}
              required
              placeholder="e.g. Nimal Perera"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Mobile Phone</label>
              <input
                type="tel"
                className="form-control"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                required
                placeholder="e.g. 0771234567"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Emergency Next-of-Kin Contact</label>
              <input
                type="tel"
                className="form-control"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="e.g. 0112345678"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Bus Number</label>
              <input
                type="text"
                className="form-control"
                value={formData.busNumber}
                onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                required
                placeholder="e.g. ND-8899"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Seat Number</label>
              <input
                type="text"
                className="form-control"
                value={formData.seatAllocated}
                onChange={(e) => setFormData({ ...formData, seatAllocated: e.target.value })}
                placeholder="e.g. A1 or B3"
              />
            </div>
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
              Register to Manifest
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EventPassengersPage;
