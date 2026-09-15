import React, { useState, useEffect } from 'react';
import eventTransportService from './eventTransportService';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import { Calendar, Plus, Edit2, Trash2, Bus, Users, BarChart2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EventsListPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'CORPORATE',
    organizerName: '',
    contactPhone: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    origin: 'Colombo Fort Terminal',
    destination: 'Kandy Peradeniya',
    requiredBuses: 2,
    requiredCapacity: 90,
    status: 'CONFIRMED'
  });

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await eventTransportService.getAllEvents();
      setEvents(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      eventName: '',
      eventType: 'CORPORATE',
      organizerName: '',
      contactPhone: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      origin: 'Colombo Fort Terminal',
      destination: 'Kandy Peradeniya',
      requiredBuses: 2,
      requiredCapacity: 90,
      status: 'CONFIRMED'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (ev) => {
    setEditingEvent(ev);
    setFormData({
      eventName: ev.eventName,
      eventType: ev.eventType,
      organizerName: ev.organizerName,
      contactPhone: ev.contactPhone,
      startDate: ev.startDate,
      endDate: ev.endDate,
      origin: ev.origin,
      destination: ev.destination,
      requiredBuses: ev.requiredBuses,
      requiredCapacity: ev.requiredCapacity,
      status: ev.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        ...formData,
        requiredBuses: parseInt(formData.requiredBuses, 10),
        requiredCapacity: parseInt(formData.requiredCapacity, 10)
      };

      if (editingEvent) {
        await eventTransportService.updateEvent(editingEvent.id, payload);
        setSuccess('Event logistics details updated successfully!');
      } else {
        await eventTransportService.createEvent(payload);
        setSuccess('New bulk transport event charter scheduled successfully!');
      }
      setIsModalOpen(false);
      loadEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel and remove this transport event?')) {
      try {
        await eventTransportService.deleteEvent(id);
        setSuccess('Transport event deleted.');
        loadEvents();
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>Bulk Special Events & Charters</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Coordinate private fleet allocations for sports tournaments, corporate outings, pilgrimages, and group excursions.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleOpenCreateModal}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> Register Event Charter
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading transport events...</div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Calendar size={48} style={{ margin: '0 auto 1rem', color: '#CBD5E1' }} />
            <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-main)' }}>No events scheduled</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Event Name & Type</th>
                  <th>Organizer / Contact</th>
                  <th>Dates (Start - End)</th>
                  <th>Origin &rarr; Destination</th>
                  <th>Fleet Quota</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{ev.eventName}</div>
                      <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                        {ev.eventType}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{ev.organizerName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ev.contactPhone}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{ev.startDate}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>to {ev.endDate}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {ev.origin} &rarr; {ev.destination}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        <strong>{ev.assignedBusesCount || 0} / {ev.requiredBuses}</strong> Buses
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Capacity: {ev.requiredCapacity} Pax
                      </div>
                    </td>
                    <td>
                      <Badge
                        variant={
                          ev.status === 'CONFIRMED' || ev.status === 'COMPLETED' ? 'success' :
                          ev.status === 'PENDING' ? 'warning' : 'neutral'
                        }
                      >
                        {ev.status}
                      </Badge>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <Link
                          to={`/events/trips?eventId=${ev.id}`}
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                          title="View Assigned Buses"
                        >
                          <Bus size={13} /> Fleet
                        </Link>
                        <Link
                          to={`/events/passengers?eventId=${ev.id}`}
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                          title="Passenger Manifest"
                        >
                          <Users size={13} /> Manifest
                        </Link>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          onClick={() => handleOpenEditModal(ev)}
                          title="Edit Event"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#DC2626', borderColor: '#FECACA' }}
                          onClick={() => handleDelete(ev.id)}
                          title="Cancel Event"
                        >
                          <Trash2 size={13} />
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

      {/* Add / Edit Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Edit Transport Event' : 'Book Special Event Charter'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Event Title</label>
            <input
              type="text"
              className="form-control"
              value={formData.eventName}
              onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
              required
              placeholder="e.g. Annual National Sports Meet Shuttle"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Event Category</label>
              <select
                className="form-control"
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              >
                <option value="CORPORATE">Corporate Outing</option>
                <option value="SPORTS">Sports Championship / Tour</option>
                <option value="EXCURSION">Educational / Group Excursion</option>
                <option value="PILGRIMAGE">Pilgrimage (Kataragama / Anuradhapura)</option>
                <option value="WEDDING">Wedding Hire Shuttle</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Organizer / Client Contact</label>
              <input
                type="text"
                className="form-control"
                value={formData.organizerName}
                onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
                required
                placeholder="e.g. National Sports Council"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="tel"
                className="form-control"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                required
                placeholder="e.g. 0719876543"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Departure Origin</label>
              <input
                type="text"
                className="form-control"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                required
                placeholder="e.g. Malabe Campus"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Destination</label>
              <input
                type="text"
                className="form-control"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                required
                placeholder="e.g. Sugathadasa Stadium, Colombo"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Buses Needed</label>
              <input
                type="number"
                min="1"
                max="20"
                className="form-control"
                value={formData.requiredBuses}
                onChange={(e) => setFormData({ ...formData, requiredBuses: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Passenger Capacity</label>
              <input
                type="number"
                min="10"
                step="5"
                className="form-control"
                value={formData.requiredCapacity}
                onChange={(e) => setFormData({ ...formData, requiredCapacity: e.target.value })}
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
              {editingEvent ? 'Update Charter' : 'Schedule Event'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EventsListPage;
