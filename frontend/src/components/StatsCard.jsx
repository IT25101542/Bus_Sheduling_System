import React from 'react';

export const StatsCard = ({ title, value, icon, color = 'blue', subtitle }) => {
  const colorMap = {
    blue: { bg: '#eff6ff', color: '#1e40af' },
    amber: { bg: '#fef3c7', color: '#b45309' },
    green: { bg: '#ecfdf5', color: '#047857' },
    purple: { bg: '#faf5ff', color: '#6b21a8' },
    rose: { bg: '#fff1f2', color: '#be123c' },
    indigo: { bg: '#e0e7ff', color: '#3730a3' },
    primary: { bg: '#eff6ff', color: '#1e40af' },
    secondary: { bg: '#fef3c7', color: '#b45309' },
    danger: { bg: '#fff1f2', color: '#be123c' },
    success: { bg: '#ecfdf5', color: '#047857' },
    warning: { bg: '#fffbeb', color: '#d97706' },
  };

  const style = colorMap[color] || colorMap.blue;

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) {
      return icon;
    }
    const IconComponent = icon;
    return <IconComponent size={24} />;
  };

  return (
    <div className="stat-card">
      {icon && (
        <div className="stat-icon" style={{ backgroundColor: style.bg, color: style.color }}>
          {renderIcon()}
        </div>
      )}
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{title}</div>
        {subtitle && <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{subtitle}</div>}
      </div>
    </div>
  );
};

export default StatsCard;
