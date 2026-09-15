import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import reservationService from './reservationService';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import { useAuth } from '../../auth/AuthContext';
import { BookmarkCheck, Edit2, Trash2, Bus, CheckCircle2, AlertCircle, Plus } from 'lucide-react';

export const ReservationsPage = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modify Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newSeat, setNewSeat] = useState('');
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');

  // Create Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [trips, setTrips] = useState([]);
  const [createData, setCreateData] = useState({
    tripId: '',
    passengerName: '',
    passengerPhone: '',
    seatNumber: '1A',
    passengerType: 'ADULT',
    paymentMethod: 'CREDIT_CARD'
  });

  const loadReservations = async () => {
    setLoading(true);
    try {
      const customerId = user?.role === 'CUSTOMER' ? user?.customerId : null;
      const res = await reservationService.getReservations(customerId);
      setReservations(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTrips = async () => {
    try {
      const res = await reservationService.getTrips();
      setTrips(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadReservations();
    loadTrips();
  }, [user]);

  const openCreateModal = () => {
    setCreateData({
      tripId: trips[0]?.id || '',
      passengerName: user?.fullName || 'Kamal Perera',
      passengerPhone: '0771234567',
      seatNumber: '1A',
      passengerType: 'ADULT',
      paymentMethod: 'CREDIT_CARD'
    });
    setError(null);
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        ...createData,
        tripId: parseInt(createData.tripId, 10),
        customerId: user?.role === 'CUSTOMER' ? user?.customerId : (user?.id || 1)
      };
      await reservationService.createReservation(payload);
      setSuccess('Seat reservation confirmed and booking ticket generated successfully!');
      setIsCreateModalOpen(false);
      loadReservations();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  const openModifyModal = (item) => {
    setEditingItem(item);
    setNewSeat(item.seatNumber);
    setPassengerName(item.passengerName);
    setPassengerPhone(item.passengerPhone);
    setError(null);
    setIsModalOpen(true);
  };

  const handleModifySubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await reservationService.modifyReservation(editingItem.id, {
        newSeatNumber: newSeat,
        passengerName,
        passengerPhone
      });
      setSuccess('Reservation details modified successfully!');
      setIsModalOpen(false);
      loadReservations();
      setTimeout(() => setSuccess(null), 3500);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation? The seat will be released.')) {
      try {
        await reservationService.cancelReservation(id);
        setSuccess('Reservation cancelled and seat released to public pool.');
        loadReservations();
        setTimeout(() => setSuccess(null), 3500);
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
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
            {user?.role === 'CUSTOMER' ? 'My Trip Reservations' : 'All Network Passenger Reservations'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Manage booked seats, passenger manifests, seat reallocation, and booking cancellations</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={openCreateModal} className="btn btn-primary">
            <Plus size={16} /> New Reservation
          </button>
          <Link to="/search" className="btn btn-secondary btn-sm">
            <Bus size={14} /> Interactive Seat Map
          </Link>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Booking Ref</th>
              <th>Route Corridor</th>
              <th>Date & Departure</th>
              <th>Passenger</th>
              <th>Phone</th>
              <th>Seat</th>
              <th>Amount</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="10" style={{ textAlign: 'center', padding: '2rem' }}>Loading reservations...</td></tr>
            ) : reservations.length === 0 ? (
              <tr><td colSpan="10" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No reservations found. Click "Book New Trip" to select a seat.</td></tr>
            ) : (
              reservations.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700 }}>#{r.id}</td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#1e3a8a', fontFamily: 'monospace' }}>
                      {r.bookingReference}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{r.routeName}</td>
                  <td>
                    <div>{r.tripDate}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{r.departureTime} → {r.arrivalTime}</div>
                  </td>
                  <td style={{ fontWeight: 700 }}>{r.passengerName}</td>
                  <td style={{ fontSize: '0.85rem' }}>{r.passengerPhone}</td>
                  <td>
                    <span style={{
                      backgroundColor: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe',
                      padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.85rem'
                    }}>
                      {r.seatNumber}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: '#047857' }}>Rs. {r.totalAmount?.toFixed(2)}</td>
                  <td>
                    <Badge status={r.reservationStatus} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      {r.reservationStatus !== 'CANCELLED' && (
                        <>
                          <button onClick={() => openModifyModal(r)} className="btn btn-secondary btn-sm">
                            <Edit2 size={14} /> Modify
                          </button>
                          <button onClick={() => handleCancel(r.id)} className="btn btn-danger btn-sm">
                            <Trash2 size={14} /> Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODIFY RESERVATION MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Modify Reservation - ${editingItem?.bookingReference}`}
      >
        {error && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            <AlertCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.4rem' }} />
            {error}
          </div>
        )}

        <form onSubmit={handleModifySubmit}>
          <div className="form-group">
            <label className="form-label">Change Seat Number</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. 2B or 3A"
              value={newSeat}
              onChange={(e) => setNewSeat(e.target.value.toUpperCase())}
            />
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Current Seat: {editingItem?.seatNumber}</span>
          </div>

          <div className="form-group">
            <label className="form-label">Passenger Full Name</label>
            <input
              type="text"
              className="form-input"
              required
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Phone</label>
            <input
              type="text"
              className="form-input"
              required
              value={passengerPhone}
              onChange={(e) => setPassengerPhone(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Modifications
            </button>
          </div>
        </form>
      </Modal>

      {/* CREATE NEW RESERVATION MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Book New Passenger Seat Reservation"
      >
        {error && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            <AlertCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.4rem' }} />
            {error}
          </div>
        )}

        <form onSubmit={handleCreateSubmit}>
          <div className="form-group">
            <label className="form-label">Select Scheduled Trip</label>
            <select
              className="form-control"
              required
              value={createData.tripId}
              onChange={(e) => setCreateData({ ...createData, tripId: e.target.value })}
            >
              <option value="">-- Choose Express Trip --</option>
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.tripCode} | {t.routeName || t.route?.name} ({t.departureTime} - Rs. {t.price || 1500})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Passenger Name</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Nimal Silva"
                value={createData.passengerName}
                onChange={(e) => setCreateData({ ...createData, passengerName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. 0771234567"
                value={createData.passengerPhone}
                onChange={(e) => setCreateData({ ...createData, passengerPhone: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Seat Number</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. 1A, 2B, 3C"
                value={createData.seatNumber}
                onChange={(e) => setCreateData({ ...createData, seatNumber: e.target.value.toUpperCase() })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Passenger Concession</label>
              <select
                className="form-control"
                value={createData.passengerType}
                onChange={(e) => setCreateData({ ...createData, passengerType: e.target.value })}
              >
                <option value="ADULT">Adult (Standard)</option>
                <option value="STUDENT">Student (Concession)</option>
                <option value="SENIOR">Senior Citizen</option>
                <option value="CHILD">Child</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm & Create Reservation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ReservationsPage;
