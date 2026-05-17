import React from 'react';
import type { InventoryStats as InventoryStatsType } from '../types/device';

interface StatsProps {
  stats: InventoryStatsType;
}

export const InventoryStats: React.FC<StatsProps> = ({ stats }) => (
  <div className="stats-grid">
    <div className="stat-card">
      <div className="stat-icon blue">🖥️</div>
      <div>
        <div className="stat-val">{stats.totalDevices}</div>
        <div className="stat-label">Total Assets</div>
      </div>
    </div>
    <div className="stat-card">
      <div className="stat-icon amber">✅</div>
      <div>
        <div className="stat-val">{stats.inventoriedLastMonth}</div>
        <div className="stat-label">Inventoried Last Month</div>
      </div>
    </div>
    <div className="stat-card">
      <div className="stat-icon red" style={{ background: 'linear-gradient(135deg, #fee2e2, #fecaca)', color: '#b91c1c' }}>⏳</div>
      <div>
        <div className="stat-val" style={{ color: '#b91c1c' }}>{stats.needsInventory}</div>
        <div className="stat-label">Needs Inventory</div>
      </div>
    </div>
  </div>
);
