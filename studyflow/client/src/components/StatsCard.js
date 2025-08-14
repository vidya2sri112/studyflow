import React from 'react';

const StatsCard = ({ title, value, subtitle, color }) => {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h4 style={{ color: 'var(--text-light)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
        {title}
      </h4>
      <div style={{ 
        fontSize: '2.5rem', 
        fontWeight: '700', 
        color: color,
        marginBottom: '0.25rem' 
      }}>
        {value}
      </div>
      <p style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>
        {subtitle}
      </p>
    </div>
  );
};

export default StatsCard;