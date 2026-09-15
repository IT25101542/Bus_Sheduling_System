import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import eventTransportService from './eventTransportService';
import tripPlanningService from '../tripPlanning/tripPlanningService';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import { Bus, Plus, Trash2, Clock, User, CheckCircle2, AlertCircle } from 'lucide-react';

export const EventTripsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialEventId = searchParams.get('eventId') || '';

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(initialEventId);
  const [eventTrips, setEventTrips] = useState([]);
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    busId: '',
    driverId: '',
    tripDate: new Date().toISOString().split('T')[0],
    departureTime: '06:30',
    returnTime: '18:30'
  });

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [evRes, busRes, drvRes] = await Promise.all([
        eventTransportService.getAllEvents(),
        tripPlanningService.getBuses(),
        tripPlanningService.getDrivers()
      ]);
      const evList = evRes.data || [];
      setEvents(evList);
      setBuses(busRes.data || []);
      setDrivers(drvRes.data || []);

      const activeEvId = selectedEventId || (evList.length > 0 ? evList[0].id.toString() : '');
      setSelectedEventId(activeEvId);
      if (activeEvId) {
        loadTripsForEvent(activeEvId);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTripsForEvent = async (eId) => {
    try {
      const res = await eventTransportService.getTripsByEvent(eId);
      setEventTrips(res.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleEventChange = (id) => {
    setSelectedEventId(id);
    loadTripsForEvent(id);
  };

  const handleOpenModal = () => {
    setFormData({
      busId: buses[0]?.id ? buses[0].id.toString() : '',
      driverId: drivers[0]?.id ? drivers[0].id.toString() : '',
      tripDate: new Date().toISOString().split('T')[0],
      departureTime: '06:30',
      returnTime: '18:30'
    });
    setIsModalOpen(true);
  };

  const handleSubmitTrip = async (e) => {
    e.preventDefault();
    if (!selectedEventId) return;
    setError(null);
    try {
      await eventTransportService.createEventTrip(selectedEventId, {
        busId: parseInt(formData.busId, 10),
        driverId: parseInt(formData.driverId, 10),
        tripDate: formData.tripDate,
        departureTime: formData.departureTime,
        returnTime: formData.returnTime
      });
      setSuccess('Coach and driver successfully assigned to event charter with zero scheduling conflicts!');
      setIsModalOpen(false);
      loadTripsForEvent(selectedEventId);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to de-allocate this bus from the event?')) {
      try {
        await eventTransportService.deleteEventTrip(tripId);
        setSuccess('Coach de-allocated.');
        loadTripsForEvent(selectedEventId);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const currentEvent = events.find(e => e.id.toString() === selectedEventId.toString());

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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>Event Fleet Allocations</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Verify bus availability and assign depot coaches without overlapping scheduled public routes.
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
                {ev.eventName} ({ev.eventType})
              </option>
            ))}
          </select>

          <button
            className="btn btn-primary"
            onClick={handleOpenModal}
            disabled={!selectedEventId}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} /> Assign Coach
          </button>
        </div>
      </div>

      {currentEvent && (
        <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Selected Charter</span>
            <h4 style={{ margin: '2px 0 0', color: 'var(--primary-color)' }}>{currentEvent.eventName}</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {currentEvent.origin} &rarr; {currentEvent.destination} ({currentEvent.startDate} to {currentEvent.endDate})
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fleet Requirement</span>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
              {eventTrips.length} / {currentEvent.requiredBuses} Buses Assigned
            </div>
          </div>
        </div>
      )}

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading assigned trips...</div>
        ) : eventTrips.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Bus size={48} style={{ margin: '0 auto 1rem', color: '#CBD5E1' }} />
            <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-main)' }}>No buses assigned to this event yet</p>
            <p>Click "Assign Coach" above to allocate buses from the depot inventory.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Bus Number</th>
                  <th>Coach Class</th>
                  <th>Capacity</th>
                  <th>Driver Assigned</th>
                  <th>Trip Date</th>
                  <th>Departure & Return</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {eventTrips.map((et) => (
                  <tr key={et.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                        <Bus size={18} />
                        {et.busNumber}
                      </div>
                    </td>
                    <td>{et.busType}</td>
                    <td>
                      <span className="badge badge-info">{et.busCapacity} Seats</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
                        <User size={14} color="var(--text-muted)" />
                        {et.driverName}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{et.tripDate}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                        <Clock size={12} color="var(--text-muted)" />
                        {et.departureTime} &rarr; {et.returnTime || 'Late Evening'}
                      </div>
                    </td>
                    <td>
                      <Badge variant="success">{et.status}</Badge>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#DC2626', borderColor: '#FECACA' }}
                        onClick={() => handleDeleteTrip(et.id)}
                        title="De-allocate Coach"
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

      {/* Assign Coach Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Assign Coach to ${currentEvent?.eventName}`}
      >
        <form onSubmit={handleSubmitTrip}>
          <div className="form-group">
            <label className="form-label">Select Available Coach</label>
            <select
              className="form-control"
              value={formData.busId}
              onChange={(e) => setFormData({ ...formData, busId: e.target.value })}
              required
            >
              {buses.map(b => (
                <option key={b.id} value={b.id}>
                  {b.busNumber} - {b.model} ({b.busType}, {b.totalSeats} seats)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Assign Qualified Driver</label>
            <select
              className="form-control"
              value={formData.driverId}
              onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
              required
            >
              {drivers.map(d => (
                <option key={d.id} value={d.id}>
                  {d.fullName} (License: {d.licenseNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Trip Date</label>
            <input
              type="date"
              className="form-control"
              value={formData.tripDate}
              onChange={(e) => setFormData({ ...formData, tripDate: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Departure Time</label>
              <input
                type="time"
                className="form-control"
                value={formData.departureTime}
                onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Estimated Return Time</label>
              <input
                type="time"
                className="form-control"
                value={formData.returnTime}
                onChange={(e) => setFormData({ ...formData, returnTime: e.target.value })}
                required
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
              Verify Availability & Assign
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EventTripsPage;
