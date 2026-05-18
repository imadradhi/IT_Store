import React from 'react';
import type { Device } from '../types/device';

interface DeviceDetailsProps {
  device: Device;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
  onMarkInventoried?: () => void;
  isUpdating?: boolean;
}

const fmt = (d: string) => {
  if (!d || d === 'None') return '—';
  try { return new Date(d).toLocaleDateString('en-GB'); }
  catch { return d; }
};

const formatName = (name: string) => {
  if (!name) return '—';
  return name.includes('@') ? name.split('@')[0] : name;
};

export const DeviceDetails: React.FC<DeviceDetailsProps> = ({ device, onEdit, onDelete, onBack, onMarkInventoried, isUpdating }) => {
  const isWithin24Hours = device.MaintenanceDate && (new Date().getTime() - new Date(device.MaintenanceDate).getTime() < 24 * 60 * 60 * 1000);

  return (
    <div className="panel" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div className="panel-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '1.25rem 2rem',
        background: 'var(--surface-2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            className="btn btn-ghost" 
            onClick={onBack} 
            style={{ 
              background: '#f1f5f9', 
              color: '#475569', 
              border: 'none',
              padding: '0.5rem',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}
            title="Go back"
          >
            ←
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>
              Asset Details
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              ID: {device.id}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {onMarkInventoried && (
            <button 
              className="btn btn-primary" 
              onClick={onMarkInventoried} 
              disabled={isWithin24Hours || isUpdating}
              style={{ 
                padding: '0.6rem 1.25rem', 
                background: isWithin24Hours ? '#94a3b8' : '#16a34a',
                cursor: isWithin24Hours ? 'not-allowed' : 'pointer',
                opacity: isUpdating ? 0.7 : 1
              }}
            >
              {isUpdating ? 'Saving...' : isWithin24Hours ? '✓ Verified' : '✓ Verify'}
            </button>
          )}
          <button className="btn btn-edit" onClick={onEdit} style={{ padding: '0.6rem 1.25rem' }}>
            ✏️ Edit
          </button>
          <button className="btn btn-del" onClick={onDelete} style={{ padding: '0.6rem 1.25rem' }}>
            🗑️ Delete
          </button>
        </div>
      </div>

      <div className="panel-body" style={{ padding: '2rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '2.5rem',
          maxWidth: '1200px'
        }}>
          
          <section>
            <h3 style={sectionHeaderStyle}>General Information</h3>
            <div style={gridStyle}>
              <DetailItem label="Asset Code" value={device.Code} highlight />
              <DetailItem label="Asset Name" value={device.Name} highlight />
              <DetailItem label="Model / Brand" value={device.Model} />
              <DetailItem label="Location" value={device.Location} />
            </div>
          </section>

          <section>
            <h3 style={sectionHeaderStyle}>Administrative</h3>
            <div style={gridStyle}>
              <DetailItem label="Receipt / Form" value={device.ReceiptForm} />
              <DetailItem label="Last Updated By" value={formatName(device.UpdatedBy)} title={device.UpdatedBy} />
              <DetailItem label="Legacy ID" value={device.Id} />
            </div>
          </section>

          <section>
            <h3 style={sectionHeaderStyle}>Inventory Dates</h3>
            <div style={gridStyle}>
              <DetailItem label="Inventory Date" value={fmt(device.MaintenanceDate)} />
            </div>
          </section>

          {device.Note && device.Note !== 'None' && (
            <section style={{ gridColumn: '1 / -1' }}>
              <h3 style={sectionHeaderStyle}>Additional Notes</h3>
              <div style={{ 
                padding: '1.5rem', 
                background: 'var(--surface-2)', 
                borderRadius: '12px', 
                border: '1px solid var(--border)',
                color: 'var(--text)',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {device.Note}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--text-muted)',
  marginBottom: '1.25rem',
  borderBottom: '1px solid var(--border)',
  paddingBottom: '0.5rem',
  fontWeight: 600
};

const gridStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem'
};

const DetailItem = ({ label, value, highlight = false, title }: { label: string, value: string, highlight?: boolean, title?: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 500 }}>{label}</span>
    <span 
      title={title}
      style={{ 
        fontSize: highlight ? '1.15rem' : '1rem', 
        color: 'var(--text)',
        fontWeight: highlight ? 700 : 500 
      }}
    >
      {value && value !== 'None' ? value : <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>—</span>}
    </span>
  </div>
);
