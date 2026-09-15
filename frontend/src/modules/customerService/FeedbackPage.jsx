import React, { useState, useEffect } from 'react';
import customerService from './customerService';
import reservationService from '../reservation/reservationService';
import Modal from '../../components/Modal';
import { useAuth } from '../../auth/AuthContext';
import { Star, MessageSquarePlus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export const FeedbackPage = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // New Feedback Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tripId, setTripId] = useState('');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [fbRes, tripsRes] = await Promise.all([
        customerService.getFeedbacks(),
        reservationService.getTrips()
      ]);
      setFeedbacks(fbRes.data || []);
      const tripList = tripsRes.data || [];
      setTrips(tripList);
      if (tripList.length > 0 && !tripId) {
        setTripId(tripList[0].id.toString());
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const selectedTrip = trips.find(t => t.id.toString() === tripId);
      await customerService.createFeedback({
        customerId: user?.customerId || null,
        customerName: user?.fullName || 'Transit Passenger',
        tripId: tripId ? parseInt(tripId, 10) : null,
        tripCode: selectedTrip?.tripNumber || 'TRP-101',
        routeName: selectedTrip?.route ? `${selectedTrip.route.originCity} - ${selectedTrip.route.destinationCity}` : 'Intercity Route',
        rating: parseInt(rating, 10),
        comments
      });
      setSuccess('Thank you! Your journey rating has been published.');
      setIsModalOpen(false);
      setComments('');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (window.confirm('Delete this feedback review?')) {
      try {
        await customerService.deleteFeedback(id);
        setSuccess('Feedback removed.');
        loadData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
    : '5.0';

  const renderStars = (count) => {
    return (
      <div style={{ display: 'inline-flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={16}
            fill={i <= count ? '#F59E0B' : '#E2E8F0'}
            color={i <= count ? '#F59E0B' : '#CBD5E1'}
          />
        ))}
      </div>
    );
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

      {/* Satisfaction Hero Metric */}
      <div
        style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: '10px',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: '#D97706', lineHeight: 1 }}>
            {avgRating}
          </div>
          <div>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={20} fill="#F59E0B" color="#F59E0B" />
              ))}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#92400E', fontWeight: 600 }}>
              Overall Passenger Satisfaction ({feedbacks.length} verified journey reviews)
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <MessageSquarePlus size={18} /> Leave Trip Review
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>Passenger Trip Reviews</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Direct feedback on coach hygiene, driver punctuality, AC comfort, and staff hospitality.
        </p>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading reviews...</div>
        ) : feedbacks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Star size={48} style={{ margin: '0 auto 1rem', color: '#CBD5E1' }} />
            <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-main)' }}>No passenger reviews yet</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Passenger</th>
                  <th>Route / Trip</th>
                  <th>Rating</th>
                  <th>Review Comments</th>
                  <th>Submitted Date</th>
                  {user?.role !== 'CUSTOMER' && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((f) => (
                  <tr key={f.id}>
                    <td style={{ fontWeight: 600 }}>{f.customerName || 'Passenger'}</td>
                    <td>
                      <div>{f.routeName || 'Intercity Trip'}</div>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                        {f.tripCode}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {renderStars(f.rating)}
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{f.rating}.0</span>
                      </div>
                    </td>
                    <td style={{ fontStyle: 'italic', color: 'var(--text-main)', maxWidth: '350px' }}>
                      "{f.comments}"
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'Recent'}
                    </td>
                    {user?.role !== 'CUSTOMER' && (
                      <td>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#DC2626', borderColor: '#FECACA' }}
                          onClick={() => handleDeleteFeedback(f.id)}
                          title="Moderate feedback"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Share Your Journey Experience"
      >
        <form onSubmit={handleSubmitFeedback}>
          <div className="form-group">
            <label className="form-label">Select Completed Trip</label>
            <select
              className="form-control"
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              required
            >
              {trips.map(t => (
                <option key={t.id} value={t.id}>
                  {t.tripNumber} ({t.route?.originCity} &rarr; {t.route?.destinationCity}) - {t.departureDate}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Service Rating (1 to 5 Stars)</label>
            <div style={{ display: 'flex', gap: '0.75rem', margin: '0.5rem 0' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRating(s)}
                  style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    backgroundColor: rating >= s ? '#FEF3C7' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Star size={20} fill={rating >= s ? '#F59E0B' : 'none'} color={rating >= s ? '#F59E0B' : '#CBD5E1'} />
                  <span style={{ fontWeight: 700 }}>{s}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Your Review & Suggestions</label>
            <textarea
              className="form-control"
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              required
              placeholder="Tell us about the driving, air conditioning comfort, bus hygiene..."
            />
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
              Post Review
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FeedbackPage;
