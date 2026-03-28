import React from 'react';
import { Battery, Wifi, Activity, AlertTriangle, ThermometerSun, Radio } from 'lucide-react';

export default function RightPanel({ activeTelemetry, robot }) {
  if (!robot) return null;

  return (
    <div className="panel right-panel">
      <h2><Activity size={24} color="var(--accent-green)" /> Live Telemetry</h2>
      
      <div className="section-label">System Status</div>
      <div className="card">
        <div className="status-row">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Battery size={16} color="var(--accent-green)" /> Battery
          </span>
          <span className="status-value">{robot.battery}%</span>
        </div>
        <div className="status-row" style={{ marginTop: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Wifi size={16} color="var(--accent-blue)" /> Signal
          </span>
          <span className="status-value">
            {activeTelemetry ? Math.round(activeTelemetry.signal_strength) : 'N/A'}%
          </span>
        </div>
      </div>

      <div className="section-label">Movement</div>
      <div className="card">
        <div className="status-row">
          <span style={{ color: 'var(--text-secondary)' }}>Speed</span>
          <span className="status-value">
            {activeTelemetry ? activeTelemetry.speed.toFixed(2) : '0.00'} m/s
          </span>
        </div>
        <div className="status-row" style={{ marginTop: '0.75rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Heading</span>
          <span className="status-value">{robot.heading}°</span>
        </div>
      </div>

      <div className="section-label">Environment Sensors</div>
      <div className="card">
        <div className="status-row">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Radio size={16} /> Water Depth
          </span>
          <span className="status-value">
            {activeTelemetry ? activeTelemetry.water_depth.toFixed(2) : '0.00'} m
          </span>
        </div>
        <div className="status-row" style={{ marginTop: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <ThermometerSun size={16} /> External Temp
          </span>
          <span className="status-value">28.4 °C</span>
        </div>
      </div>

      <div className="section-label">Alerts</div>
      <div className="card" style={{ borderLeft: '3px solid var(--accent-orange)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-orange)', fontWeight: 600, marginBottom: '0.5rem' }}>
          <AlertTriangle size={18} /> Proximity Warning
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Debris detected approx 15m ahead on planned route.
        </div>
      </div>
    </div>
  );
}
