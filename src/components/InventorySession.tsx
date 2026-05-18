import React, { useState } from 'react';
import type { Device } from '../types/device';

interface InventorySessionProps {
  devices: Device[];
  onInventory: (device: Device) => Promise<void>;
  isUpdating: string | null;
}

export const InventorySession: React.FC<InventorySessionProps> = ({ devices, onInventory, isUpdating }) => {
  const [search, setSearch] = useState('');

  const filtered = devices.filter(d => 
    [d.Code, d.Name, d.Location].some(v => (v || '').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="panel" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="panel-title">Inventory Session</span>
        <span className="badge-email" style={{ margin: 0 }}>
          {devices.length} Total Assets
        </span>
      </div>

      <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.5)', flexShrink: 0 }}>
        <div className="search-box" style={{ maxWidth: '400px' }}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search asset code, name, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="panel-body">
        <div className="desktop-table">
          <table className="assets-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Location</th>
                <th>Last Inventory</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => {
                const lastInvDate = d.MaintenanceDate ? new Date(d.MaintenanceDate).toLocaleDateString('en-GB') : '—';
                const isWithin24Hours = d.MaintenanceDate && (new Date().getTime() - new Date(d.MaintenanceDate).getTime() < 24 * 60 * 60 * 1000);

                return (
                  <tr key={d.id} style={{ background: isWithin24Hours ? '#f0fdf4' : 'inherit' }}>
                    <td style={{ fontWeight: 600 }}>{d.Code}</td>
                    <td style={{ fontWeight: 600 }}>{d.Name}</td>
                    <td>{d.Location}</td>
                    <td>
                      <span className="dash">{lastInvDate}</span>
                      {isWithin24Hours && <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: '#16a34a', fontWeight: 'bold' }}>(Recently)</span>}
                    </td>
                    <td>
                      <button 
                        className="btn btn-primary"
                        style={{ 
                          padding: '0.4rem 1rem', 
                          background: isWithin24Hours ? '#94a3b8' : '#16a34a',
                          cursor: isWithin24Hours ? 'not-allowed' : 'pointer',
                          opacity: isUpdating === d.id ? 0.7 : 1
                        }}
                        disabled={isWithin24Hours || isUpdating === d.id}
                        onClick={() => onInventory(d)}
                      >
                        {isUpdating === d.id ? 'Saving...' : isWithin24Hours ? '✓ Verified' : '✓ Verify'}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No assets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Cards ── */}
        <div className="mobile-cards" style={{ padding: '1rem' }}>
          {filtered.map(d => {
            const lastInvDate = d.MaintenanceDate ? new Date(d.MaintenanceDate).toLocaleDateString('en-GB') : '—';
            const isWithin24Hours = d.MaintenanceDate && (new Date().getTime() - new Date(d.MaintenanceDate).getTime() < 24 * 60 * 60 * 1000);

            return (
              <div className="asset-card" key={d.id} style={{ background: isWithin24Hours ? '#f0fdf4' : 'var(--surface)' }}>
                <div className="asset-card-header">
                  <div>
                    <span style={{ fontWeight: 600 }}>{d.Code}</span>&nbsp;
                    <span className="asset-card-title">{d.Name}</span>
                  </div>
                </div>

                <div className="asset-card-meta">
                  <div className="asset-card-meta-item">
                    <span className="meta-label">Location</span>
                    <span className="meta-value">{d.Location || '—'}</span>
                  </div>
                  <div className="asset-card-meta-item">
                    <span className="meta-label">Last Inventory</span>
                    <span className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className="dash">{lastInvDate}</span>
                      {isWithin24Hours && <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 'bold' }}>(Recently)</span>}
                    </span>
                  </div>
                </div>

                <div className="asset-card-actions">
                  <button 
                    className="btn btn-primary"
                    style={{ 
                      width: '100%',
                      background: isWithin24Hours ? '#94a3b8' : '#16a34a',
                      cursor: isWithin24Hours ? 'not-allowed' : 'pointer',
                      opacity: isUpdating === d.id ? 0.7 : 1
                    }}
                    disabled={isWithin24Hours || isUpdating === d.id}
                    onClick={() => onInventory(d)}
                  >
                    {isUpdating === d.id ? 'Saving...' : isWithin24Hours ? '✓ Verified' : '✓ Verify'}
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No assets found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
