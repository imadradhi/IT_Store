import React from 'react';
import type { Device } from '../types/device';

interface DeviceListProps {
  devices: Device[];
  onView: (device: Device) => void;
}

const fmt = (d: string) => {
  if (!d || d === 'None') return null;
  try { return new Date(d).toLocaleDateString('en-GB'); }
  catch { return d; }
};

const formatName = (name: string) => {
  if (!name) return '';
  // If it's an email/username (contains @), we might still want to trim it for old records
  // but if it's a full name (no @), we return it as is.
  return name.includes('@') ? name.split('@')[0] : name;
};

export const DeviceList: React.FC<DeviceListProps> = ({ devices, onView }) => {
  if (devices.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📦</div>
        <p>No assets registered yet</p>
      </div>
    );
  }

  return (
    <>
      {/* ── Desktop Table ── */}
      <div className="desktop-table">
        <table className="assets-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Model</th>
              <th>Location</th>
              <th>Maintenance Date</th>
              <th>Note</th>
              <th>Receipt</th>
              <th>Last Updated By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((d) => (
              <tr key={d.id}>
                <td style={{ fontWeight: 600 }}>{d.Code}</td>
                <td style={{ fontWeight: 600 }}>{d.Name}</td>
                <td>{d.Model}</td>
                <td>{d.Location}</td>
                <td><span className="dash">{fmt(d.MaintenanceDate) ?? '—'}</span></td>
                <td>
                  {d.Note && d.Note !== 'None'
                    ? <span title={d.Note}>{d.Note}</span>
                    : <span className="dash">—</span>}
                </td>
                <td>
                  {d.ReceiptForm && d.ReceiptForm !== 'None'
                    ? <span>{d.ReceiptForm}</span>
                    : <span className="dash">—</span>}
                </td>
                <td>
                  {d.UpdatedBy
                    ? <span title={d.UpdatedBy}>{formatName(d.UpdatedBy)}</span>
                    : <span className="dash">—</span>}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '.4rem', justifyContent: 'center' }}>
                    <button className="btn btn-primary" onClick={() => onView(d)} style={{ padding: '0.4rem 1rem' }}>View</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="mobile-cards">
        {devices.map((d) => (
          <div className="asset-card" key={d.id}>
            <div className="asset-card-header">
              <div>
                <span style={{ fontWeight: 600 }}>{d.Code}</span>&nbsp;
                <span className="asset-card-title">{d.Name}</span>
              </div>
            </div>

            <div className="asset-card-meta">
              <div className="asset-card-meta-item">
                <span className="meta-label">Model</span>
                <span className="meta-value">{d.Model || '—'}</span>
              </div>
              <div className="asset-card-meta-item">
                <span className="meta-label">Location</span>
                <span className="meta-value">{d.Location || '—'}</span>
              </div>
              <div className="asset-card-meta-item">
                <span className="meta-label">Maintenance Date</span>
                <span className="meta-value">{fmt(d.MaintenanceDate) ?? '—'}</span>
              </div>
              {d.Note && d.Note !== 'None' && (
                <div className="asset-card-meta-item" style={{ gridColumn: 'span 2' }}>
                  <span className="meta-label">Note</span>
                  <span className="meta-value">{d.Note}</span>
                </div>
              )}
              {d.ReceiptForm && d.ReceiptForm !== 'None' && (
                <div className="asset-card-meta-item">
                  <span className="meta-label">Receipt</span>
                  <span className="meta-value">{d.ReceiptForm}</span>
                </div>
              )}
              {d.UpdatedBy && (
                <div className="asset-card-meta-item" style={{ gridColumn: 'span 2' }}>
                  <span className="meta-label">Last Updated By</span>
                  <span className="meta-value" title={d.UpdatedBy}>{formatName(d.UpdatedBy)}</span>
                </div>
              )}
            </div>

            <div className="asset-card-actions">
              <button className="btn btn-primary" onClick={() => onView(d)} style={{ width: '100%' }}>👁️ View Details</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
