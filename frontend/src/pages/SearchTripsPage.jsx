import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../auth/AuthContext';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { 
  Bus, Search, Calendar, MapPin, Clock, DollarSign, 
  CheckCircle2, AlertCircle, Ticket as TicketIcon, UserCheck
} from 'lucide-react';

export const SearchTripsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const [origin, setOrigin] = useState(queryParams.get('origin') || '');
  const [destination, setDestination] = useState(queryParams.get('destination') || '');
  const [date, setDate] = useState(queryParams.get('date') || new Date().toISOString().split('T')[0]);

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Booking Modal State
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripDetails, setTripDetails] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [passengerName, setPassengerName] = useState(user?.fullName || '');
  const [passengerPhone, setPassengerPhone] = useState('+94 77 123 4567');
  const [passengerNic, setPassengerNic] = useState('200012345678');
  const [passengerType, setPassengerType] = useState('ADULT');
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  const fetchTrips = async (overrideOrigin, overrideDestination, overrideDate) => {
    setLoading(true);
    setError(null);
    try {
      const qParams = new URLSearchParams(location.search);
      const searchOrigin = overrideOrigin !== undefined ? overrideOrigin : (qParams.get('origin') || origin);
      const searchDestination = overrideDestination !== undefined ? overrideDestination : (qParams.get('destination') || destination);
      const searchDate = overrideDate !== undefined ? overrideDate : (qParams.get('date') || date);

      let url = '/trips';
      const params = [];
      if (searchOrigin && searchOrigin.trim()) params.push(`origin=${encodeURIComponent(searchOrigin.trim())}`);
      if (searchDestination && searchDestination.trim()) params.push(`destination=${encodeURIComponent(searchDestination.trim())}`);
      if (searchDate && searchDate.trim()) params.push(`date=${searchDate.trim()}`);
      if (params.length > 0) url += `?${params.join('&')}`;

      const res = await axiosClient.get(url);
      const tripsList = Array.isArray(res) ? res : (res?.data || []);
      setTrips(tripsList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const qParams = new URLSearchParams(location.search);
    const o = qParams.get('origin') || '';
    const d = qParams.get('destination') || '';
    const dt = qParams.get('date') || '';
    setOrigin(o);
    setDestination(d);
    setDate(dt);
    fetchTrips(o, d, dt);
  }, [location.search]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (origin.trim()) params.append('origin', origin.trim());
    if (destination.trim()) params.append('destination', destination.trim());
    if (date) params.append('date', date);
    navigate(`/search?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setOrigin('');
    setDestination('');
    setDate('');
    navigate('/search');
  };

  const handleOpenBooking = async (trip) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedTrip(trip);
    setSelectedSeat(null);
    setBookingSuccess(null);
    setBookingError(null);
    try {
      const res = await axiosClient.get(`/trips/${trip.id}`);
      setTripDetails(res?.data || res);
    } catch (err) {
      setBookingError(err.message);
    }
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedSeat) {
      setBookingError('Please select an available seat from the bus seat map.');
      return;
    }

    setBookingLoading(true);
    setBookingError(null);
    try {
      // 1. Create Reservation
      const resRes = await axiosClient.post('/reservations', {
        tripId: selectedTrip.id,
        customerId: user?.customerId || null,
        passengerName,
        passengerPhone,
        passengerNic,
        seatNumber: selectedSeat,
        passengerType,
        paymentMethod
      });
      const reservation = resRes?.data || resRes;

      // 2. Mock Payment & Ticket Generation
      await axiosClient.post('/payments', {
        reservationId: reservation.id,
        amount: reservation.totalAmount,
        paymentMethod
      });

      const tktRes = await axiosClient.get(`/tickets/reservation/${reservation.id}`);

      setBookingSuccess({
        reservation,
        ticket: tktRes?.data || tktRes
      });

      // Refresh trips list
      fetchTrips();
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>Available Express Bus Trips</h1>
        <p style={{ color: '#64748b' }}>Search schedules, view available seats in real-time, and reserve your ticket.</p>
      </div>

      {/* FILTER BAR */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <form onSubmit={handleFilterSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label className="form-label">From</label>
            <input
              type="text"
              className="form-input"
              list="search-origins-list"
              placeholder="e.g. Colombo (Makumbura)"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
            <datalist id="search-origins-list">
              <option value="Colombo (Makumbura)" />
              <option value="Colombo (Fort)" />
              <option value="Galle" />
              <option value="Kandy" />
              <option value="Jaffna" />
              <option value="Anuradhapura" />
              <option value="Badulla" />
              <option value="Trincomalee" />
              <option value="Negombo" />
              <option value="Nuwara Eliya" />
              <option value="Hambantota" />
              <option value="Kurunegala" />
              <option value="Matara" />
            </datalist>
          </div>
          <div>
            <label className="form-label">To</label>
            <input
              type="text"
              className="form-input"
              list="search-destinations-list"
              placeholder="e.g. Galle"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            <datalist id="search-destinations-list">
              <option value="Galle" />
              <option value="Kandy" />
              <option value="Jaffna" />
              <option value="Anuradhapura" />
              <option value="Badulla" />
              <option value="Trincomalee" />
              <option value="Negombo" />
              <option value="Nuwara Eliya" />
              <option value="Hambantota" />
              <option value="Kurunegala" />
              <option value="Matara" />
              <option value="Colombo (Makumbura)" />
              <option value="Colombo (Fort)" />
            </datalist>
          </div>
          <div>
            <label className="form-label">Travel Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Search size={16} /> Filter Results
            </button>
            {(origin || destination || date) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn btn-outline"
                title="Clear all filters"
              >
                Reset
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ERROR / LOADING */}
      {loading && <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading available trips...</div>}
      {error && <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

      {/* TRIPS LIST */}
      {!loading && trips.length === 0 && (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Bus size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#334155' }}>No trips found matching your search</h3>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Try clearing filters or choosing another date.</p>
          <button onClick={handleClearFilters} className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
            View All Scheduled Trips
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {trips.map((trip) => (
          <div key={trip.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '12px',
                backgroundColor: '#eff6ff', color: '#1e3a8a', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <Bus size={28} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>{trip.routeNumber}</span>
                  <Badge status={trip.busType?.replace('_', ' ')} type="primary" />
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Trip: {trip.tripCode}</span>
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                  {trip.origin} → {trip.destination}
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#64748b', marginTop: '0.35rem' }}>
                  <span><Clock size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Dep: {trip.departureTime} - Arr: {trip.arrivalTime}</span>
                  <span>Bus: {trip.busNumber}</span>
                  <span>Driver: {trip.driverName}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Available Seats</div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: trip.availableSeats > 5 ? '#047857' : trip.availableSeats > 0 ? '#b45309' : '#dc2626'
                }}>
                  {trip.availableSeats} / {trip.totalSeats}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Standard Fare</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e3a8a' }}>
                  Rs. {trip.fareAmount?.toFixed(2)}
                </div>
              </div>

              <div>
                {trip.availableSeats > 0 ? (
                  <button onClick={() => handleOpenBooking(trip)} className="btn btn-primary">
                    Select Seat & Book
                  </button>
                ) : (
                  <button onClick={() => navigate('/waiting-list')} className="btn btn-accent btn-sm">
                    Join Waiting List
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL WITH INTERACTIVE SEAT MAP */}
      <Modal
        isOpen={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
        title={bookingSuccess ? 'Booking & Ticket Confirmation' : `Select Seat - ${selectedTrip?.origin} to ${selectedTrip?.destination}`}
        size="lg"
      >
        {bookingSuccess ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <CheckCircle2 size={60} color="#10b981" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#065f46', marginBottom: '0.5rem' }}>
              Reservation Confirmed!
            </h2>
            <p style={{ color: '#475569', marginBottom: '1.5rem' }}>
              Your electronic ticket has been successfully issued with reference:
              <strong> {bookingSuccess.reservation?.bookingReference}</strong>
            </p>

            {/* PRINTABLE TICKET CARD */}
            <div className="ticket-card" style={{ textAlign: 'left', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
              <div className="ticket-header">
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e3a8a' }}>LANKA TRANSIT SERVICES</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ELECTRONIC BOARDING PASS</div>
                </div>
                <span className="badge badge-success">PAID & ISSUED</span>
              </div>

              <div className="ticket-grid">
                <div>
                  <div className="ticket-field-label">Ticket Number</div>
                  <div className="ticket-field-val">{bookingSuccess.ticket?.ticketNumber}</div>
                </div>
                <div>
                  <div className="ticket-field-label">Booking Ref</div>
                  <div className="ticket-field-val">{bookingSuccess.reservation?.bookingReference}</div>
                </div>
                <div>
                  <div className="ticket-field-label">Passenger</div>
                  <div className="ticket-field-val">{bookingSuccess.reservation?.passengerName}</div>
                </div>
                <div>
                  <div className="ticket-field-label">Seat Number</div>
                  <div className="ticket-field-val" style={{ color: '#2563eb', fontSize: '1.2rem' }}>
                    {bookingSuccess.reservation?.seatNumber}
                  </div>
                </div>
                <div>
                  <div className="ticket-field-label">Route</div>
                  <div className="ticket-field-val">{selectedTrip?.origin} → {selectedTrip?.destination}</div>
                </div>
                <div>
                  <div className="ticket-field-label">Departure</div>
                  <div className="ticket-field-val">{selectedTrip?.tripDate} at {selectedTrip?.departureTime}</div>
                </div>
                <div>
                  <div className="ticket-field-label">Total Fare</div>
                  <div className="ticket-field-val">Rs. {bookingSuccess.reservation?.totalAmount?.toFixed(2)}</div>
                </div>
                <div>
                  <div className="ticket-field-label">QR Reference</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#047857' }}>
                    {bookingSuccess.ticket?.qrCode}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => navigate('/reservations')} className="btn btn-primary">
                View in My Bookings
              </button>
              <button onClick={() => setSelectedTrip(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            {bookingError && (
              <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                <AlertCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.4rem' }} />
                {bookingError}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* LEFT: SEAT MAP */}
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>
                  Select Your Seat (2x2 Luxury Layout)
                </h4>

                <div className="seat-bus-container">
                  <div className="bus-front-cabin">
                    <span>Front Entrance</span>
                    <span>Driver Cabin</span>
                  </div>

                  {/* Generate 10 rows of 4 seats (A, B aisle C, D) */}
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((row) => {
                    const seatA = tripDetails?.seats?.find(s => s.seatNumber === `${row}A`);
                    const seatB = tripDetails?.seats?.find(s => s.seatNumber === `${row}B`);
                    const seatC = tripDetails?.seats?.find(s => s.seatNumber === `${row}C`);
                    const seatD = tripDetails?.seats?.find(s => s.seatNumber === `${row}D`);

                    const renderSeatBtn = (s, code) => {
                      const isBooked = s?.seatStatus === 'BOOKED';
                      const isSelected = selectedSeat === code;

                      let cls = 'seat-btn seat-available';
                      if (isBooked) cls = 'seat-btn seat-booked';
                      else if (isSelected) cls = 'seat-btn seat-selected';

                      return (
                        <button
                          key={code}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSelectedSeat(code)}
                          className={cls}
                          title={isBooked ? `Seat ${code} is Booked` : `Select Seat ${code}`}
                        >
                          {code}
                        </button>
                      );
                    };

                    return (
                      <div key={row} className="seat-row">
                        <div className="seat-group">
                          {renderSeatBtn(seatA, `${row}A`)}
                          {renderSeatBtn(seatB, `${row}B`)}
                        </div>
                        <div className="seat-aisle">{row}</div>
                        <div className="seat-group">
                          {renderSeatBtn(seatC, `${row}C`)}
                          {renderSeatBtn(seatD, `${row}D`)}
                        </div>
                      </div>
                    );
                  })}

                  <div className="seat-legend">
                    <div className="legend-item">
                      <div className="legend-box" style={{ background: '#ecfdf5', border: '1px solid #10b981' }}></div>
                      <span>Available</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-box" style={{ background: '#1e3a8a' }}></div>
                      <span>Selected</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-box" style={{ background: '#fee2e2', border: '1px solid #ef4444' }}></div>
                      <span>Booked</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: PASSENGER & PAYMENT FORM */}
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>
                  Passenger & Mock Payment Details
                </h4>

                <form onSubmit={handleConfirmBooking}>
                  <div className="form-group">
                    <label className="form-label">Selected Seat</label>
                    <div style={{
                      padding: '0.6rem 0.8rem', background: selectedSeat ? '#eff6ff' : '#f1f5f9',
                      borderRadius: '6px', fontWeight: 800, color: selectedSeat ? '#1e40af' : '#94a3b8',
                      fontSize: '1rem', border: '1px solid #cbd5e1'
                    }}>
                      {selectedSeat ? `Seat ${selectedSeat} (Confirmed)` : 'No seat selected yet'}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Passenger Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        value={passengerPhone}
                        onChange={(e) => setPassengerPhone(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">NIC / Passport</label>
                      <input
                        type="text"
                        className="form-input"
                        value={passengerNic}
                        onChange={(e) => setPassengerNic(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Passenger Type</label>
                      <select
                        className="form-select"
                        value={passengerType}
                        onChange={(e) => setPassengerType(e.target.value)}
                      >
                        <option value="ADULT">Adult (Standard)</option>
                        <option value="CHILD">Child (50% Concession)</option>
                        <option value="STUDENT">Student (25% Concession)</option>
                        <option value="SENIOR">Senior Citizen (30% Concession)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Payment Method</label>
                      <select
                        className="form-select"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value="CREDIT_CARD">Credit / Debit Card (Mock)</option>
                        <option value="ONLINE_TRANSFER">Online Bank Transfer</option>
                        <option value="CASH">Pay at Depot Counter</option>
                      </select>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px',
                    border: '1px solid #e2e8f0', marginBottom: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                      <span>Base Ticket Price:</span>
                      <span>Rs. {selectedTrip?.fareAmount?.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                      <span>Loyalty Reward Points to Earn:</span>
                      <span style={{ fontWeight: 700, color: '#b45309' }}>+85 Points</span>
                    </div>
                    <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: '#1e3a8a' }}>
                      <span>Total to Pay:</span>
                      <span>Rs. {selectedTrip?.fareAmount?.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedSeat || bookingLoading}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.8rem' }}
                  >
                    {bookingLoading ? 'Processing Booking & Payment...' : 'Confirm Reservation & Pay'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SearchTripsPage;
