import React from 'react';
import type { Device } from '../types/device';

interface DetailedStatsProps {
  devices: Device[];
  onClose: () => void;
}

export const DetailedStats: React.FC<DetailedStatsProps> = ({ devices, onClose }) => {
  const stats = {
    'All in One': 0,
    'Laptop': 0,
    'Desktop': 0,
    'Printer': 0,
    'X-Printer': 0,
    'Barcode Reader': 0,
    'Barcode Printer': 0,
    'UPS': 0,
    'POS': 0,
    'Scanner': 0,
    'Other': 0,
  };

  devices.forEach(d => {
    const code = (d.Code || '').toUpperCase();
    if (code.startsWith('BR')) stats['Barcode Reader']++;
    else if (code.startsWith('BP')) stats['Barcode Printer']++;
    else if (code.startsWith('POS')) stats['POS']++;
    else if (code.startsWith('A')) stats['All in One']++;
    else if (code.startsWith('L')) stats['Laptop']++;
    else if (code.startsWith('D')) stats['Desktop']++;
    else if (code.startsWith('P')) stats['Printer']++;
    else if (code.startsWith('X')) stats['X-Printer']++;
    else if (code.startsWith('U')) stats['UPS']++;
    else if (code.startsWith('S')) stats['Scanner']++;
    else stats['Other']++;
  });

  return (
    <div className="panel" style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', width: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, color: 'var(--text)' }}>📊 Assets by Category</h2>
        <button className="btn" style={{ background: '#f1f5f9', color: '#64748b' }} onClick={onClose}>
          ← Back to List
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {Object.entries(stats).map(([type, count]) => {
          if (count === 0) return null; // Only show categories that have items
          return (
            <div key={type} className="stat-card" style={{ padding: '1.25rem' }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div className="stat-label" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-muted)' }}>{type}</div>
                <div className="stat-val" style={{ fontSize: '2rem', color: 'var(--primary)', marginTop: '0.5rem' }}>{count}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
