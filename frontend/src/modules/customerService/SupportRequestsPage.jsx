import React, { useState, useEffect } from 'react';
import customerService from './customerService';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import { useAuth } from '../../auth/AuthContext';
import { HelpCircle, Plus, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react';

export const SupportRequestsPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // New Request Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

  // Response Modal (Supervisor)
  const [isRespondOpen, setIsRespondOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [resolveStatus, setResolveStatus] = useState('CLOSED');

  const loadRequests = async () => {
    setLoading(true);
    try {
      const customerId = user?.role === 'CUSTOMER' ? user?.customerId : null;
      const res = await customerService.getSupportRequests(customerId);
      setRequests(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [user]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await customerService.createSupportRequest({
        customerId: user?.customerId || null,
        customerName: user?.fullName || 'Transit Passenger',
        subject,
        priority,
        description
      });
      setSuccess('Support ticket created. A helpdesk agent will respond shortly.');
      setIsCreateOpen(false);
      setSubject('');
      setDescription('');
      loadRequests();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRespondSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReq) return;
    setError(null);
    try {
      await customerService.respondSupportRequest(selectedReq.id, responseText, resolveStatus);
      setSuccess('Response sent to passenger and ticket updated.');
      setIsRespondOpen(false);
      loadRequests();
    } catch (err) {
      setError(err.message);
    }
  };

  const openRespondModal = (req) => {
    setSelectedReq(req);
    setResponseText(req.response || '');
    setIsRespondOpen(true);
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>Support Helpdesk Tickets</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage general service queries, timetable clarifications, and lost-property inquiries.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setIsCreateOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> New Support Inquiry
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading tickets...</div>
        ) : requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <HelpCircle size={48} style={{ margin: '0 auto 1rem', color: '#CBD5E1' }} />
            <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-main)' }}>No support inquiries found</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Ref #</th>
                  <th>Customer</th>
                  <th>Priority</th>
                  <th>Inquiry Details</th>
                  <th>Agent Response</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary-color)' }}>
                        {r.requestCode}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{r.customerName}</td>
                    <td>
                      <span
                        className={`badge badge-${
                          r.priority === 'URGENT' || r.priority === 'HIGH' ? 'danger' : 'neutral'
                        }`}
                      >
                        {r.priority}
                      </span>
                    </td>
                    <td style={{ maxWidth: '280px' }}>
                      <div style={{ fontWeight: 600 }}>{r.subject}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.description}</div>
                    </td>
                    <td style={{ maxWidth: '250px' }}>
                      {r.response ? (
                        <div style={{ fontSize: '0.85rem', color: '#059669', fontStyle: 'italic' }}>
                          "{r.response}"
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Awaiting agent reply</span>
                      )}
                    </td>
                    <td>
                      <Badge variant={r.status === 'OPEN' ? 'warning' : 'success'}>
                        {r.status}
                      </Badge>
                    </td>
                    <td>
                      {user?.role !== 'CUSTOMER' && (
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          onClick={() => openRespondModal(r)}
                        >
                          <MessageCircle size={14} /> Respond
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Inquiry Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Submit New Support Ticket"
      >
        <form onSubmit={handleCreateSubmit}>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              type="text"
              className="form-control"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="e.g. Inquiring about luggage limits on AC Highway buses"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Priority Level</label>
            <select
              className="form-control"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Message / Details</label>
            <textarea
              className="form-control"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Explain what assistance you need..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Send Inquiry
            </button>
          </div>
        </form>
      </Modal>

      {/* Supervisor Respond Modal */}
      <Modal
        isOpen={isRespondOpen}
        onClose={() => setIsRespondOpen(false)}
        title={`Helpdesk Response: ${selectedReq?.requestCode}`}
      >
        <form onSubmit={handleRespondSubmit}>
          <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', border: '1px solid #E2E8F0' }}>
            <strong>Passenger Question:</strong>
            <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {selectedReq?.description}
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Official Helpdesk Response</label>
            <textarea
              className="form-control"
              rows={4}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              required
              placeholder="Type official response..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ticket Status After Reply</label>
            <select
              className="form-control"
              value={resolveStatus}
              onChange={(e) => setResolveStatus(e.target.value)}
            >
              <option value="CLOSED">CLOSED (Resolved completely)</option>
              <option value="IN_PROGRESS">IN_PROGRESS (Follow up pending)</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsRespondOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Send Response
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SupportRequestsPage;
