import React, { useState, useEffect } from 'react';
import customerService from './customerService';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import { useAuth } from '../../auth/AuthContext';
import { AlertTriangle, Plus, CheckCircle2, AlertCircle, Edit3, MessageSquare, Search, Trash2 } from 'lucide-react';

export const ComplaintsPage = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Submit Complaint Modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: 'BUS_CONDITION',
    subject: '',
    description: '',
    tripReference: ''
  });

  // Supervisor Status Modal
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('IN_PROGRESS');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const customerId = user?.role === 'CUSTOMER' ? user?.customerId : null;
      const res = await customerService.getComplaints(customerId);
      setComplaints(res.data || []);
      setFilteredComplaints(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [user]);

  useEffect(() => {
    let list = complaints;
    if (statusFilter !== 'ALL') {
      list = list.filter(c => c.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        c =>
          c.complaintCode?.toLowerCase().includes(q) ||
          c.subject?.toLowerCase().includes(q) ||
          c.customerName?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q)
      );
    }
    setFilteredComplaints(list);
  }, [searchQuery, statusFilter, complaints]);

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await customerService.createComplaint({
        ...formData,
        customerId: user?.customerId || null,
        customerName: user?.fullName || 'Transit Passenger'
      });
      setSuccess('Complaint ticket logged successfully! Our supervisor team is reviewing it.');
      setIsSubmitModalOpen(false);
      setFormData({
        category: 'BUS_CONDITION',
        subject: '',
        description: '',
        tripReference: ''
      });
      loadComplaints();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenStatusModal = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setResolutionNotes(complaint.resolutionNotes || '');
    setIsStatusModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setError(null);
    try {
      await customerService.updateComplaintStatus(selectedComplaint.id, newStatus, resolutionNotes);
      setSuccess(`Complaint ${selectedComplaint.complaintCode} status transitioned to ${newStatus}.`);
      setIsStatusModalOpen(false);
      loadComplaints();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (window.confirm('Are you sure you want to remove this customer complaint record?')) {
      setError(null);
      try {
        await customerService.deleteComplaint(id);
        setSuccess('Complaint ticket record removed successfully.');
        loadComplaints();
        setTimeout(() => setSuccess(null), 3500);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN': return <span className="badge badge-warning">OPEN</span>;
      case 'IN_PROGRESS': return <span className="badge badge-info">IN PROGRESS</span>;
      case 'RESOLVED': return <span className="badge badge-success">RESOLVED</span>;
      case 'CLOSED': return <span className="badge badge-neutral">CLOSED</span>;
      default: return <span className="badge badge-neutral">{status}</span>;
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>Customer Grievance Incident Tracker</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Full resolution lifecycle: <span style={{ fontWeight: 600 }}>OPEN &rarr; IN PROGRESS &rarr; RESOLVED &rarr; CLOSED</span>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            className="form-control"
            style={{ width: '150px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open Only</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search complaint..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2rem', width: '200px' }}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setIsSubmitModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} /> Log Complaint
          </button>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading complaints...</div>
        ) : filteredComplaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <AlertTriangle size={48} style={{ margin: '0 auto 1rem', color: '#CBD5E1' }} />
            <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-main)' }}>No complaint tickets found</p>
            <p>No complaints match your search filter or all issues have been addressed.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Customer</th>
                  <th>Category</th>
                  <th>Subject & Details</th>
                  <th>Trip Ref</th>
                  <th>Logged Date</th>
                  <th>Lifecycle Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-color)' }}>
                        {c.complaintCode}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{c.customerName || 'Passenger'}</td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                        {c.category?.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ maxWidth: '280px' }}>
                      <div style={{ fontWeight: 600 }}>{c.subject}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {c.description}
                      </div>
                      {c.resolutionNotes && (
                        <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '2px', fontWeight: 500 }}>
                          Resolution: {c.resolutionNotes}
                        </div>
                      )}
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {c.tripReference || 'General'}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {c.submittedAt ? new Date(c.submittedAt).toLocaleDateString() : 'Recent'}
                    </td>
                    <td>{getStatusBadge(c.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        {user?.role !== 'CUSTOMER' && (
                          <button
                            className="btn btn-outline"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                            onClick={() => handleOpenStatusModal(c)}
                            title="Manage Lifecycle Status"
                          >
                            <Edit3 size={14} /> Update
                          </button>
                        )}
                        <button
                          className="btn btn-danger"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          onClick={() => handleDeleteComplaint(c.id)}
                          title="Delete Record"
                        >
                          <Trash2 size={14} /> Delete
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

      {/* Submit Complaint Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Lodge Customer Service Complaint"
      >
        <form onSubmit={handleSubmitComplaint}>
          <div className="form-group">
            <label className="form-label">Incident Category</label>
            <select
              className="form-control"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="BUS_CONDITION">Bus Condition / Cleanliness / AC Breakdown</option>
              <option value="DRIVER_CONDUCT">Driver or Conductor Conduct / Rash Driving</option>
              <option value="SCHEDULE_DELAY">Trip Delay / Departure Punctuality</option>
              <option value="FARE_ISSUE">Overcharge / Billing or Fare Dispute</option>
              <option value="LOST_PROPERTY">Lost Baggage / Forgotten Items</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Trip Reference (Optional)</label>
            <input
              type="text"
              className="form-control"
              value={formData.tripReference}
              onChange={(e) => setFormData({ ...formData, tripReference: e.target.value })}
              placeholder="e.g. TRP-101 or Bus ND-8899"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Subject Headline</label>
            <input
              type="text"
              className="form-control"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
              placeholder="Brief summary of the issue..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Incident Description & Location</label>
            <textarea
              className="form-control"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Provide exact details of what occurred..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsSubmitModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit Grievance Ticket
            </button>
          </div>
        </form>
      </Modal>

      {/* Supervisor Status Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title={`Resolve Complaint ${selectedComplaint?.complaintCode}`}
      >
        <form onSubmit={handleUpdateStatus}>
          <div className="form-group">
            <label className="form-label">Change Lifecycle State</label>
            <select
              className="form-control"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              required
            >
              <option value="OPEN">OPEN (Under review)</option>
              <option value="IN_PROGRESS">IN_PROGRESS (Investigating with depot/driver)</option>
              <option value="RESOLVED">RESOLVED (Action taken / refunded / apologized)</option>
              <option value="CLOSED">CLOSED (Case completed)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Resolution Notes / Corrective Actions</label>
            <textarea
              className="form-control"
              rows={4}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="e.g. Warning issued to driver, 100 loyalty points compensation credited to customer..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsStatusModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Resolution
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ComplaintsPage;
