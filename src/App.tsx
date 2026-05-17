import { useState, useEffect } from 'react';
import type { Device, InventoryStats as InventoryStatsType } from './types/device';
import {
  subscribeToDevices,
  addDevice,
  updateDevice,
  deleteDevice,
  calculateStats,
} from './services/deviceService';
import { subscribeToAuthChanges, logout, type AppUser } from './services/authService';
import { InventoryStats } from './components/InventoryStats';
import { DeviceList } from './components/DeviceList';
import { DeviceForm } from './components/DeviceForm';
import { DeviceDetails } from './components/DeviceDetails';
import { DetailedStats } from './components/DetailedStats';
import { InventorySession } from './components/InventorySession';
import { Login } from './components/Login';
import * as XLSX from 'xlsx';
import './App.css';

function App() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [stats, setStats] = useState<InventoryStatsType>({ totalDevices: 0, withNotes: 0, locations: 0 });
  const [selected, setSelected] = useState<Device | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'inventory'>('list');
  const [isUpdatingInventory, setIsUpdatingInventory] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToAuthChanges((u) => { setUser(u); setAuthLoading(false); });
    return () => unsub();
  }, []);

  // ── منع زر الرجوع في المتصفح ──
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!user) { setDevices([]); return; }
    const unsub = subscribeToDevices(
      (data) => { setDevices(data); setStats(calculateStats(data)); setError(null); },
      (err) => setError('Database error: ' + err.message)
    );
    return () => unsub();
  }, [user]);

  const handleAdd = async (data: Omit<Device, 'id'>) => {
    // Check for duplicate code
    const exists = devices.some(d => d.Code.toLowerCase() === data.Code.toLowerCase());
    if (exists) {
      setError(`Asset code "${data.Code}" already exists. Please use a unique code.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSaving(true); setError(null);
    try { await addDevice(data); setShowForm(false); }
    catch { setError('Failed to add asset.'); }
    finally { setIsSaving(false); }
  };

  const handleInventorySession = async (device: Device) => {
    setIsUpdatingInventory(device.id);
    try {
      const updatedData = {
        ...device,
        MaintenanceDate: new Date().toISOString(),
        UpdatedBy: user?.fullname || device.UpdatedBy
      };
      const { id, ...rest } = updatedData;
      await updateDevice(id, rest);
    } catch (err) {
      setError('Failed to update inventory status.');
    } finally {
      setIsUpdatingInventory(null);
    }
  };

  const handleUpdate = async (data: Omit<Device, 'id'>) => {
    if (!selected) return;
    if (!window.confirm('هل أنت متأكد من حفظ التعديلات على هذه المادة؟')) return;
    setIsSaving(true); setError(null);
    try { await updateDevice(selected.id, data); setSelected(null); setShowForm(false); }
    catch { setError('Failed to update asset.'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المادة نهائياً؟')) return;
    setError(null);
    try { await deleteDevice(id); setShowDetails(false); }
    catch { setError('Failed to delete asset.'); }
  };

  const handleExport = () => {
    try {
      const dataToExport = filtered.map(d => ({
        'Asset Code': d.Code,
        'Name': d.Name,
        'Model': d.Model,
        'Location': d.Location,
        'Last Inventory Date': d.MaintenanceDate ? new Date(d.MaintenanceDate).toLocaleDateString() : 'None',
        'Next Inventory Date': d.RequiredMaintenanceDate ? new Date(d.RequiredMaintenanceDate).toLocaleDateString() : 'None',
        'Note': d.Note || 'None',
        'Receipt Form': d.ReceiptForm || 'None',
        'Last Updated By': d.UpdatedBy || 'Unknown'
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      if (!window.confirm('هل تريد تصدير قائمة المواد الحالية إلى ملف Excel؟')) return;
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Assets');
      XLSX.writeFile(workbook, `IT_Stock_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (err) {
      setError('Failed to export Excel file.');
      console.error(err);
    }
  };

  const filtered = devices.filter(d =>
    [d.Code, d.Name, d.Model, d.Location, d.Note, d.UpdatedBy]
      .some(v => (v || '').toLowerCase().includes(search.toLowerCase()))
  );

  const currentSelectedDevice = selected ? (devices.find(d => d.id === selected.id) || selected) : null;

  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={() => {
      const u = localStorage.getItem('it_stock_user');
      if (u) setUser(JSON.parse(u));
    }} />;
  }

  return (
    <>
      {/* ── Top Navigation ── */}
      <nav className="topnav">
        <div className="topnav-brand">
          <span>🖥️</span>
          <span>V 0.0.1 - IT Stock</span>
        </div>
        <div className="topnav-actions">
          <span className="badge-email" title={user.username}>{user.fullname}</span>
          <button
            className="btn btn-ghost"
            onClick={() => {
              if (window.confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                logout();
              }
            }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="main-content">

        {error && (
          <div className="alert-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {showForm ? (
          <DeviceForm
            device={selected}
            onSubmit={selected ? handleUpdate : handleAdd}
            onCancel={() => { setSelected(null); setShowForm(false); }}
            isLoading={isSaving}
            currentUserFullname={user.fullname}
          />
        ) : showDetailedStats ? (
          <DetailedStats
            devices={devices}
            onClose={() => setShowDetailedStats(false)}
          />
        ) : showDetails && currentSelectedDevice ? (
          <DeviceDetails
            device={currentSelectedDevice}
            onEdit={() => { setShowDetails(false); setShowForm(true); }}
            onDelete={() => handleDelete(currentSelectedDevice.id)}
            onBack={() => { setShowDetails(false); setSelected(null); }}
            onMarkInventoried={() => handleInventorySession(currentSelectedDevice)}
            isUpdating={isUpdatingInventory === currentSelectedDevice.id}
          />
        ) : (
          <>
            {/* Tabs Container */}
            <div className="tabs-container" style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginBottom: '1.5rem', 
              borderBottom: '2px solid var(--border)',
              padding: '0 0.5rem'
            }}>
              <button 
                onClick={() => setActiveTab('list')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'list' ? '3px solid var(--primary)' : '3px solid transparent',
                  color: activeTab === 'list' ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: activeTab === 'list' ? 700 : 500,
                  cursor: 'pointer',
                  fontSize: '1.05rem',
                  transform: 'translateY(2px)'
                }}
              >
                Assets & Equipment List
              </button>
              <button 
                onClick={() => setActiveTab('inventory')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'inventory' ? '3px solid var(--primary)' : '3px solid transparent',
                  color: activeTab === 'inventory' ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: activeTab === 'inventory' ? 700 : 500,
                  cursor: 'pointer',
                  fontSize: '1.05rem',
                  transform: 'translateY(2px)'
                }}
              >
                Inventory Session
              </button>
            </div>

            {activeTab === 'list' ? (
              <>
                {/* Stats */}
                <InventoryStats stats={stats} />

                {/* Toolbar */}
                <div className="toolbar">
                  <button
                    className="btn btn-primary"
                    onClick={() => { setSelected(null); setShowForm(true); }}
                  >
                    ➕ Add Asset
                  </button>
                  <button
                    className="btn btn-ghost"
                    style={{ background: '#e2e8f0', color: '#334155', border: 'none' }}
                    onClick={() => setShowDetailedStats(true)}
                  >
                    📊 Statistics
                  </button>
                  <button
                    className="btn btn-ghost"
                    style={{ background: '#dcfce7', color: '#166534', border: 'none' }}
                    onClick={handleExport}
                  >
                    📥 Export Excel
                  </button>

                  <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                      type="text"
                      placeholder="Search by code, name, location, updated by..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <span className="count-badge">{filtered.length} assets</span>
                </div>

                {/* Table / Cards */}
                <div className="panel">
                  <div className="panel-header">
                    <span className="panel-title">Assets & Equipment List</span>
                  </div>
                  <div className="panel-body">
                    <DeviceList
                      devices={filtered}
                      onView={(d) => { setSelected(d); setShowDetails(true); }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <InventorySession 
                devices={devices} 
                onInventory={handleInventorySession} 
                isUpdating={isUpdatingInventory} 
              />
            )}
          </>
        )}

      </main>
    </>
  );
}

export default App;
