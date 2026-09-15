import React, { useState, useEffect } from 'react';
import reservationService from './reservationService';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import { useAuth } from '../../auth/AuthContext';
import { Clock, UserPlus, Trash2, Bus, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WaitingListPage = () => {
  const { user } = useAuth();
  const [waitingList, setWaitingList] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Join Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tripId, setTripId] = useState('');
  const [passengerName, setPassengerName] = useState(user?.fullName || '');
  const [passengerPhone, setPassengerPhone] = useState(user?.phone || '');
  const [seatsRequested, setSeatsRequested] = useState(1);

  // Alternatives Modal
  const [altModalOpen, setAltModalOpen] = useState(false);
  const [selectedTripNumber, setSelectedTripNumber] = useState('');
  const [alternatives, setAlternatives] = useState([]);
  const [loadingAlt, setLoadingAlt] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [wlRes, tripsRes] = await Promise.all([
        reservationService.getWaitingList(),
        reservationService.getTrips()
      ]);
      setWaitingList(wlRes.data || []);
      setTrips(tripsRes.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await reservationService.addToWaitingList({
        tripId: parseInt(tripId, 10),
        customerId: user?.customerId || null,
        passengerName,
        passengerPhone,
        seatsRequested: parseInt(seatsRequested, 10)
      });
      setSuccess('Successfully added to the waiting list!');
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemove = async (id) => {
    if (window.confirm('Are you sure you want to cancel this waiting list request?')) {
      try {
        await reservationService.removeFromWaitingList(id);
        setSuccess('Removed from waiting list successfully.');
        loadData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleViewAlternatives = async (tId, tNumber) => {
    setSelectedTripNumber(tNumber);
    setAltModalOpen(true);
    setLoadingAlt(true);
    try {
      const res = await reservationService.getAlternativeTrips(tId);
      setAlternatives(res.data || []);
    } catch (err) {
      setAlternatives([]);
    } finally {
      setLoadingAlt(false);
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>Trip Waiting List Queue</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Automated priority queue for fully booked journeys. Customers are notified when cancellations occur.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (trips.length > 0) setTripId(trips[0].id.toString());
            setIsModalOpen(true);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <UserPlus size={18} /> Join Waiting List
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading queue entries...</div>
        ) : waitingList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Clock size={48} style={{ margin: '0 auto 1rem', color: '#CBD5E1' }} />
            <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-main)' }}>No one is currently on the waiting list</p>
            <p>All scheduled trips currently have seats available or no active waitlist requests.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Queue #</th>
                  <th>Trip #</th>
                  <th>Route</th>
                  <th>Passenger</th>
                  <th>Phone</th>
                  <th>Seats</th>
                  <th>Joined Date/Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {waitingList.map((entry, index) => (
                  <tr key={entry.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--primary-color)', fontSize: '1.1rem' }}>
                        #{index + 1}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{entry.tripNumber || 'TRP-' + entry.tripId}</span>
                    </td>
                    <td>
                      {entry.routeOrigin && entry.routeDestination ? (
                        <span>{entry.routeOrigin} &rarr; {entry.routeDestination}</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Trip {entry.tripId}</span>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{entry.passengerName}</td>
                    <td>{entry.passengerPhone}</td>
                    <td>
                      <span className="badge badge-info">{entry.seatsRequested} Seat(s)</span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {entry.requestDate ? new Date(entry.requestDate).toLocaleString() : 'Recent'}
                    </td>
                    <td>
                      <Badge
                        variant={
                          entry.status === 'ALLOCATED' ? 'success' :
                          entry.status === 'WAITING' ? 'warning' : 'neutral'
                        }
                      >
                        {entry.status}
                      </Badge>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          title="Check alternative trips"
                          onClick={() => handleViewAlternatives(entry.tripId, entry.tripNumber || `TRP-${entry.tripId}`)}
                        >
                          <Bus size={14} /> Alternatives
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#DC2626', borderColor: '#FECACA' }}
                          title="Cancel request"
                          onClick={() => handleRemove(entry.id)}
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

      {/* Join Waiting List Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Join Trip Waiting List"
      >
        <form onSubmit={handleJoinSubmit}>
          <div className="form-group">
            <label className="form-label">Select Fully Booked Trip</label>
            <select
              className="form-control"
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              required
            >
              <option value="">-- Choose a trip --</option>
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.tripNumber} ({t.route?.originCity} &rarr; {t.route?.destinationCity}) - {t.departureDate} at {t.departureTime} (Avail: {t.availableSeats})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Passenger Name</label>
            <input
              type="text"
              className="form-control"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              required
              placeholder="e.g. Kasun Silva"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Phone</label>
            <input
              type="tel"
              className="form-control"
              value={passengerPhone}
              onChange={(e) => setPassengerPhone(e.target.value)}
              required
              placeholder="e.g. 0771234567"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Seats Required</label>
            <input
              type="number"
              min="1"
              max="5"
              className="form-control"
              value={seatsRequested}
              onChange={(e) => setSeatsRequested(e.target.value)}
              required
            />
            <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
              Maximum 5 seats per waiting list entry.
            </small>
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
              Confirm & Join Queue
            </button>
          </div>
        </form>
      </Modal>

      {/* Alternatives Modal */}
      <Modal
        isOpen={altModalOpen}
        onClose={() => setAltModalOpen(false)}
        title={`Alternative Trips for ${selectedTripNumber}`}
      >
        <div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            The following departures are available on the same route with vacant seats:
          </p>
          {loadingAlt ? (
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>Searching nearby trips...</div>
          ) : alternatives.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
              No other alternative trips found on this route.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {alternatives.map((alt) => (
                <div
                  key={alt.id}
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#F8FAFC'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--primary-color)' }}>
                      {alt.tripNumber} ({alt.bus?.busType})
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Departs: {alt.departureDate} at {alt.departureTime} | Available: <span style={{ fontWeight: 600, color: '#059669' }}>{alt.availableSeats} seats</span>
                    </div>
                  </div>
                  <Link
                    to={`/search`}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    Book Seat <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button className="btn btn-outline" onClick={() => setAltModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WaitingListPage;
