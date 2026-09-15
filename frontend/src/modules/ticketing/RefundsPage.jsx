import React, { useState, useEffect } from 'react';
import ticketingService from './ticketingService';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import { RefreshCcw, Plus, CheckCircle2, AlertCircle, DollarSign } from 'lucide-react';

export const RefundsPage = () => {
  const [refunds, setRefunds] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Refund Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [reason, setReason] = useState('Trip cancellation by passenger');
  const [refundPercent, setRefundPercent] = useState(90);
  const [selectedTicketObj, setSelectedTicketObj] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [refundsRes, ticketsRes] = await Promise.all([
        ticketingService.getRefunds(),
        ticketingService.getTickets()
      ]);
      setRefunds(refundsRes.data || []);
      const issuedTickets = (ticketsRes.data || []).filter(t => t.status === 'ISSUED');
      setTickets(issuedTickets);
      if (issuedTickets.length > 0 && !ticketId) {
        setTicketId(issuedTickets[0].id.toString());
        setSelectedTicketObj(issuedTickets[0]);
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

  const handleTicketChange = (id) => {
    setTicketId(id);
    const found = tickets.find(t => t.id.toString() === id);
    setSelectedTicketObj(found || null);
  };

  const calculatedRefundAmount = selectedTicketObj
    ? (selectedTicketObj.fareAmount * (refundPercent / 100))
    : 0;

  const handleSubmitRefund = async (e) => {
    e.preventDefault();
    if (!ticketId) return;
    setError(null);
    try {
      await ticketingService.processRefund({
        ticketId: parseInt(ticketId, 10),
        reason: `${reason} (${refundPercent}% refund policy)`
      });
      setSuccess('Refund processed and issued successfully!');
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.message);
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>Refund Claims & Processing</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Process and verify passenger ticket refund reimbursements according to cancellation policy.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> Process New Refund
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading refund records...</div>
        ) : refunds.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <RefreshCcw size={48} style={{ margin: '0 auto 1rem', color: '#CBD5E1' }} />
            <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-main)' }}>No refunds processed yet</p>
            <p>All issued tickets are active or no refund requests have been submitted.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Refund Ref</th>
                  <th>Ticket #</th>
                  <th>Passenger</th>
                  <th>Refund Amount</th>
                  <th>Reason</th>
                  <th>Processed Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary-color)' }}>
                      {r.refundRef}
                    </td>
                    <td style={{ fontFamily: 'monospace' }}>
                      {r.ticketNumber}
                    </td>
                    <td style={{ fontWeight: 600 }}>{r.passengerName}</td>
                    <td style={{ fontWeight: 700, color: '#DC2626' }}>
                      LKR {r.refundAmount?.toFixed(2)}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{r.reason}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {r.processedAt ? new Date(r.processedAt).toLocaleString() : 'Recent'}
                    </td>
                    <td>
                      <Badge variant="warning">{r.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Process Refund Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Process Ticket Refund"
      >
        <form onSubmit={handleSubmitRefund}>
          <div className="form-group">
            <label className="form-label">Select Issued Ticket</label>
            <select
              className="form-control"
              value={ticketId}
              onChange={(e) => handleTicketChange(e.target.value)}
              required
            >
              <option value="">-- Choose Ticket --</option>
              {tickets.map(t => (
                <option key={t.id} value={t.id}>
                  {t.ticketNumber} ({t.passengerName} - {t.routeName}, LKR {t.fareAmount})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Refund Policy Bracket</label>
            <select
              className="form-control"
              value={refundPercent}
              onChange={(e) => setRefundPercent(parseInt(e.target.value, 10))}
            >
              <option value="100">100% Full Refund (Service Disruption / Lanka Transit Fault)</option>
              <option value="90">90% Standard Refund (Cancellation &gt; 24h prior)</option>
              <option value="75">75% Late Refund (Cancellation &gt; 6h prior)</option>
              <option value="50">50% Emergency Cancellation (&lt; 6h prior)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Reason</label>
            <textarea
              className="form-control"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              placeholder="State reason for the cancellation claim..."
            />
          </div>

          {selectedTicketObj && (
            <div style={{ padding: '0.75rem 1rem', backgroundColor: '#FEF2F2', borderRadius: '6px', border: '1px solid #FECACA', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', color: '#991B1B' }}>
                Original Fare: <strong>LKR {selectedTicketObj.fareAmount?.toFixed(2)}</strong>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#B91C1C', marginTop: '4px' }}>
                Reimbursement Amount: LKR {calculatedRefundAmount.toFixed(2)}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#DC2626', borderColor: '#DC2626' }}>
              Authorize Refund
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RefundsPage;
