import React, { useState, useEffect } from 'react';
import ticketingService from './ticketingService';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import { useAuth } from '../../auth/AuthContext';
import { Ticket as TicketIcon, Printer, QrCode, Trash2, CheckCircle2, AlertCircle, Bus, Search } from 'lucide-react';

export const TicketsListPage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // E-Ticket Preview Modal
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const customerId = user?.role === 'CUSTOMER' ? user?.customerId : null;
      const res = await ticketingService.getTickets(customerId);
      setTickets(res.data || []);
      setFilteredTickets(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [user]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTickets(tickets);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredTickets(
        tickets.filter(
          (t) =>
            t.ticketNumber?.toLowerCase().includes(q) ||
            t.bookingReference?.toLowerCase().includes(q) ||
            t.passengerName?.toLowerCase().includes(q) ||
            t.routeName?.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, tickets]);

  const handleOpenPreview = (ticket) => {
    setSelectedTicket(ticket);
    setIsPreviewOpen(true);
  };

  const handleCancelTicket = async (id) => {
    if (window.confirm('Are you sure you want to void/cancel this electronic ticket?')) {
      try {
        await ticketingService.cancelTicket(id);
        setSuccess('Ticket cancelled successfully.');
        loadTickets();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handlePrint = () => {
    window.print();
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>Electronic Tickets (E-Tickets)</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Official digital bus passes generated upon successful booking & payment verification.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search ticket, ref or passenger..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2rem', width: '260px' }}
            />
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading tickets...</div>
        ) : filteredTickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <TicketIcon size={48} style={{ margin: '0 auto 1rem', color: '#CBD5E1' }} />
            <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-main)' }}>No tickets found</p>
            <p>No electronic tickets match your query.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Booking Ref</th>
                  <th>Passenger</th>
                  <th>Route</th>
                  <th>Trip Date & Time</th>
                  <th>Seat</th>
                  <th>Fare (LKR)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--primary-color)', fontFamily: 'monospace' }}>
                        {ticket.ticketNumber}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                        {ticket.bookingReference || 'N/A'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{ticket.passengerName}</td>
                    <td>{ticket.routeName}</td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{ticket.tripDate}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ticket.departureTime}</div>
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ fontWeight: 700 }}>
                        {ticket.seatNumber}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      LKR {ticket.fareAmount?.toFixed(2)}
                    </td>
                    <td>
                      <Badge
                        variant={
                          ticket.status === 'ISSUED' ? 'success' :
                          ticket.status === 'BOARDED' ? 'neutral' : 'danger'
                        }
                      >
                        {ticket.status}
                      </Badge>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          onClick={() => handleOpenPreview(ticket)}
                          title="View & Print E-Ticket"
                        >
                          <QrCode size={14} /> View Pass
                        </button>
                        {ticket.status === 'ISSUED' && user?.role !== 'CUSTOMER' && (
                          <button
                            className="btn btn-outline"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#DC2626', borderColor: '#FECACA' }}
                            onClick={() => handleCancelTicket(ticket.id)}
                            title="Cancel Ticket"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* E-Ticket Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Electronic Boarding Pass (E-Ticket)"
      >
        {selectedTicket && (
          <div>
            <div
              id="printable-ticket"
              style={{
                border: '2px dashed var(--primary-color)',
                borderRadius: '12px',
                padding: '1.5rem',
                backgroundColor: '#FAFAFA',
                marginBottom: '1.5rem'
              }}
            >
              {/* Ticket Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ backgroundColor: 'var(--primary-color)', color: '#fff', padding: '0.4rem', borderRadius: '6px' }}>
                    <Bus size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                      LANKA TRANSIT SERVICES
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Official Digital Boarding Pass</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-success" style={{ fontSize: '0.85rem' }}>{selectedTicket.status}</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Ticket #{selectedTicket.ticketNumber}
                  </div>
                </div>
              </div>

              {/* Journey Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Route</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{selectedTicket.routeName}</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Travel Date</span>
                      <div style={{ fontWeight: 600 }}>{selectedTicket.tripDate}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Departure</span>
                      <div style={{ fontWeight: 600 }}>{selectedTicket.departureTime}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Passenger</span>
                      <div style={{ fontWeight: 600 }}>{selectedTicket.passengerName}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assigned Seat</span>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--secondary-color)' }}>
                        {selectedTicket.seatNumber}
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code Graphic Box */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      backgroundColor: '#1E293B',
                      borderRadius: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFF',
                      padding: '4px',
                      marginBottom: '0.5rem'
                    }}
                  >
                    <QrCode size={70} color="#FFFFFF" />
                  </div>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                    {selectedTicket.qrCode ? selectedTicket.qrCode.substring(0, 16) + '...' : 'LT-VALIDATED'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                    Scan at Bus Gate
                  </span>
                </div>
              </div>

              {/* Ticket Footer */}
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Bus: </span>
                  <strong>{selectedTicket.busNumber || 'Assigned Depot Coach'}</strong>
                  <span style={{ margin: '0 0.5rem', color: '#CBD5E1' }}>|</span>
                  <span style={{ color: 'var(--text-muted)' }}>Ref: </span>
                  <strong>{selectedTicket.bookingReference}</strong>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary-color)' }}>
                  Total Paid: LKR {selectedTicket.fareAmount?.toFixed(2)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsPreviewOpen(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handlePrint}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Printer size={16} /> Print Pass
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TicketsListPage;
