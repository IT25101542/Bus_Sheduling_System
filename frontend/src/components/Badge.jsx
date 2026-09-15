import React from 'react';

export const Badge = ({ status, type }) => {
  const getBadgeClass = (s) => {
    if (!s) return 'badge-gray';
    const val = s.toUpperCase();
    if (['ACTIVE', 'CONFIRMED', 'COMPLETED', 'RESOLVED', 'AVAILABLE', 'ISSUED', 'PROCESSED'].includes(val)) {
      return 'badge-success';
    }
    if (['PENDING', 'IN_PROGRESS', 'BOARDING', 'MODIFIED', 'SILVER', 'GOLD'].includes(val)) {
      return 'badge-warning';
    }
    if (['CANCELLED', 'SUSPENDED', 'MAINTENANCE', 'FAILED', 'REJECTED', 'BOOKED', 'ON_LEAVE'].includes(val)) {
      return 'badge-danger';
    }
    if (['OPEN', 'IN_TRANSIT', 'SCHEDULED', 'PLATINUM'].includes(val)) {
      return 'badge-primary';
    }
    return 'badge-gray';
  };

  return <span className={`badge ${type ? `badge-${type}` : getBadgeClass(status)}`}>{status}</span>;
};

export default Badge;
