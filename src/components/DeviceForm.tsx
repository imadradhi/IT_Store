import React, { useState, useEffect } from 'react';
import type { Device } from '../types/device';

interface DeviceFormProps {
  device: Device | null;
  onSubmit: (device: Omit<Device, 'id'>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  currentUserEmail: string;
}

const empty = (email: string): Omit<Device, 'id'> => ({
  Code: '', Id: '', Name: '', Model: '', Location: '',
  MaintenanceDate: '', RequiredMaintenanceDate: '',
  Note: '', ReceiptForm: 'None', UpdatedBy: email,
});

export const DeviceForm: React.FC<DeviceFormProps> = ({
  device, onSubmit, onCancel, isLoading, currentUserEmail,
}) => {
  const [f, setF] = useState<Omit<Device, 'id'>>(empty(currentUserEmail));

  useEffect(() => {
    if (device) {
      setF({
        Code: device.Code || '',
        Id: device.Id || '',
        Name: device.Name || '',
        Model: device.Model || '',
        Location: device.Location || '',
        MaintenanceDate: device.MaintenanceDate ? device.MaintenanceDate.split('T')[0] : '',
        RequiredMaintenanceDate: device.RequiredMaintenanceDate
          ? device.RequiredMaintenanceDate.split('T')[0] : '',
        Note: device.Note || '',
        ReceiptForm: device.ReceiptForm || 'None',
        UpdatedBy: currentUserEmail,
      });
    } else {
      setF(empty(currentUserEmail));
    }
  }, [device, currentUserEmail]);

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setF(prev => ({ ...prev, [name]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...f,
      Id: f.Code,
      UpdatedBy: currentUserEmail,
      MaintenanceDate: f.MaintenanceDate ? new Date(f.MaintenanceDate).toISOString() : '',
      RequiredMaintenanceDate: f.RequiredMaintenanceDate
        ? new Date(f.RequiredMaintenanceDate).toISOString() : '',
    };
    await onSubmit(data);
  };

  return (
    <div className="form-panel">
      <div className="form-header">
        {device ? '✏️ Edit Asset' : '➕ Add New Asset'}
      </div>
      <div className="form-body">
        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Code * {device && '(Read-only)'}</label>
              <input 
                name="Code" 
                value={f.Code} 
                onChange={change} 
                required 
                className="form-input" 
                placeholder="A001" 
                disabled={!!device}
                style={device ? { background: '#f8fafc', cursor: 'not-allowed' } : {}}
              />
              {!device && <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Must be unique</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input name="Name" value={f.Name} onChange={change} required className="form-input" placeholder="AllinOne" />
            </div>
            <div className="form-group">
              <label className="form-label">Model *</label>
              <input name="Model" value={f.Model} onChange={change} required className="form-input" placeholder="HP / LENOVO ..." />
            </div>
            <div className="form-group col-2">
              <label className="form-label">Location *</label>
              <input name="Location" value={f.Location} onChange={change} required className="form-input" placeholder="Ground Floor Reception" />
            </div>
            <div className="form-group">
              <label className="form-label">Receipt Form</label>
              <input name="ReceiptForm" value={f.ReceiptForm} onChange={change} className="form-input" placeholder="None" />
            </div>
            <div className="form-group">
              <label className="form-label">Maintenance Date</label>
              <input type="date" name="MaintenanceDate" value={f.MaintenanceDate} onChange={change} className="form-input" />
            </div>
            <div className="form-group col-2">
              <label className="form-label">Note</label>
              <input name="Note" value={f.Note} onChange={change} className="form-input" placeholder="In use, In storage..." />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : device ? '💾 Update' : '➕ Add Asset'}
            </button>
            <button type="button" className="btn" style={{ background: '#f1f5f9', color: '#64748b' }} onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
