import React, { useState, useEffect } from 'react';
import eventTransportService from './eventTransportService';
import StatsCard from '../../components/StatsCard';
import Badge from '../../components/Badge';
import { BarChart2, Bus, Users, TrendingUp, AlertCircle } from 'lucide-react';

export const EventReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await eventTransportService.getAllEventReports();
      setReports(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const totalEvents = reports.length;
  const totalAssignedBuses = reports.reduce((acc, r) => acc + (r.assignedBuses || 0), 0);
  const totalPassengers = reports.reduce((acc, r) => acc + (r.totalRegisteredPassengers || 0), 0);
  const avgUtilization = reports.length > 0
    ? (reports.reduce((acc, r) => acc + (r.utilizationRate || 0), 0) / reports.length).toFixed(1)
    : 0;

  return (
    <div>
      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>Bulk Charter Performance & Analytics</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Real-time metrics tracking fleet deployment efficiency, seat utilization, and passenger turnouts for private events.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Compiling logistics report...</div>
      ) : (
        <>
          <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
            <StatsCard
              title="Active Event Charters"
              value={totalEvents}
              icon={<BarChart2 size={24} />}
              color="primary"
            />
            <StatsCard
              title="Total Coaches Deployed"
              value={totalAssignedBuses}
              icon={<Bus size={24} />}
              color="secondary"
            />
            <StatsCard
              title="Bulk Passengers Served"
              value={totalPassengers}
              icon={<Users size={24} />}
              color="warning"
            />
            <StatsCard
              title="Avg Fleet Utilization"
              value={`${avgUtilization}%`}
              icon={<TrendingUp size={24} />}
              color="success"
            />
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '1rem' }}>
              Special Event Fleet Utilization Breakdown
            </h3>

            {reports.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No event utilization reports available.</p>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Event Title</th>
                      <th>Category</th>
                      <th>Buses (Assigned / Req)</th>
                      <th>Capacity (Pax / Target)</th>
                      <th>Checked-In Turnout</th>
                      <th>Utilization Rate</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r) => (
                      <tr key={r.eventId}>
                        <td style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{r.eventName}</td>
                        <td>
                          <span className="badge badge-info">{r.eventType}</span>
                        </td>
                        <td>
                          <strong>{r.assignedBuses}</strong> / {r.requiredBuses} Buses
                        </td>
                        <td>
                          <strong>{r.totalRegisteredPassengers}</strong> / {r.requiredCapacity} Pax
                        </td>
                        <td>
                          <span style={{ color: '#059669', fontWeight: 600 }}>
                            {r.checkedInPassengers} Pax ({r.totalRegisteredPassengers > 0 ? Math.round((r.checkedInPassengers / r.totalRegisteredPassengers) * 100) : 0}%)
                          </span>
                        </td>
                        <td style={{ minWidth: '150px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ flex: 1, height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                              <div
                                style={{
                                  width: `${Math.min(r.utilizationRate || 0, 100)}%`,
                                  height: '100%',
                                  backgroundColor: (r.utilizationRate || 0) >= 80 ? '#10B981' : (r.utilizationRate || 0) >= 50 ? '#F59E0B' : '#EF4444'
                                }}
                              ></div>
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, width: '45px', textAlign: 'right' }}>
                              {r.utilizationRate?.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <Badge variant="success">{r.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EventReportsPage;
