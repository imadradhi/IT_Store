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
      <div className="stat-icon amber">📝</div>
      <div>
        <div className="stat-val">{stats.withNotes}</div>
        <div className="stat-label">With Notes</div>
      </div>
    </div>
    <div className="stat-card">
      <div className="stat-icon green">📍</div>
      <div>
        <div className="stat-val">{stats.locations}</div>
        <div className="stat-label">Locations</div>
      </div>
    </div>
  </div>
);
