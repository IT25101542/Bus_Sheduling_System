import React, { useState, useEffect } from 'react';
import customerService from './customerService';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import { useAuth } from '../../auth/AuthContext';
import { Bell, Send, Check, Trash2, AlertCircle, CheckCircle2, Megaphone } from 'lucide-react';

export const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Broadcast Modal
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    notificationType: 'INFO',
    recipientRole: 'CUSTOMER'
  });

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await customerService.getNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await customerService.markNotificationRead(id);
      loadNotifications();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await customerService.deleteNotification(id);
      setSuccess('Notification removed.');
      loadNotifications();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await customerService.sendNotification(formData);
      setSuccess('Service announcement dispatched to all active passengers and staff.');
      setIsBroadcastOpen(false);
      setFormData({
        title: '',
        message: '',
        notificationType: 'INFO',
        recipientRole: 'CUSTOMER'
      });
      loadNotifications();
    } catch (err) {
      setError(err.message);
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'ALERT': return <span className="badge badge-danger">ALERT</span>;
      case 'DELAY': return <span className="badge badge-warning">DELAY</span>;
      case 'PROMOTION': return <span className="badge badge-secondary">PROMO</span>;
      default: return <span className="badge badge-info">INFO</span>;
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>Service Bulletins & Notifications</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Instant alerts for highway delays, booking confirmations, weather advisories, and promotional campaigns.
          </p>
        </div>

        {user?.role !== 'CUSTOMER' && (
          <button
            className="btn btn-primary"
            onClick={() => setIsBroadcastOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Megaphone size={18} /> Broadcast Announcement
          </button>
        )}
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Bell size={48} style={{ margin: '0 auto 1rem', color: '#CBD5E1' }} />
            <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-main)' }}>No notifications right now</p>
            <p>You are all caught up with recent updates.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  backgroundColor: n.read ? '#FAFAFA' : '#EFF6FF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    {getTypeBadge(n.notificationType)}
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {n.title}
                    </h4>
                    {!n.read && (
                      <span style={{ width: '8px', height: '8px', backgroundColor: '#3B82F6', borderRadius: '50%' }}></span>
                    )}
                  </div>
                  <p style={{ margin: '0.5rem 0 0.75rem', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Target: <strong>{n.recipientRole || 'ALL'}</strong> &bull; {n.createdAt ? new Date(n.createdAt).toLocaleString() : 'Recent'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  {!n.read && (
                    <button
                      className="btn btn-outline"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      onClick={() => handleMarkAsRead(n.id)}
                      title="Mark as read"
                    >
                      <Check size={14} /> Read
                    </button>
                  )}
                  {user?.role !== 'CUSTOMER' && (
                    <button
                      className="btn btn-outline"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#DC2626', borderColor: '#FECACA' }}
                      onClick={() => handleDelete(n.id)}
                      title="Delete notification"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Broadcast Announcement Modal */}
      <Modal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        title="Broadcast System Notification / Alert"
      >
        <form onSubmit={handleBroadcastSubmit}>
          <div className="form-group">
            <label className="form-label">Bulletin Type</label>
            <select
              className="form-control"
              value={formData.notificationType}
              onChange={(e) => setFormData({ ...formData, notificationType: e.target.value })}
            >
              <option value="INFO">Information (Standard announcement)</option>
              <option value="ALERT">Safety / Urgent Advisory</option>
              <option value="DELAY">Highway Delay / Weather Warning</option>
              <option value="PROMOTION">Promotional Discount Bulletin</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Recipient Audience</label>
            <select
              className="form-control"
              value={formData.recipientRole}
              onChange={(e) => setFormData({ ...formData, recipientRole: e.target.value })}
            >
              <option value="CUSTOMER">All Registered Customers</option>
              <option value="OPERATIONS_MANAGER">Operations Staff & Drivers</option>
              <option value="ALL">Everyone</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Headline / Title</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g. Expressway Maintenance Advisory: Southern Highway"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Message Body</label>
            <textarea
              className="form-control"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              placeholder="Enter message details for passenger broadcast..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsBroadcastOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Send size={16} /> Broadcast Now
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NotificationsPage;
