import React from 'react';
import { Battery, Wifi, Activity, AlertTriangle, ThermometerSun, Radio, ShieldAlert, Cpu, Settings } from 'lucide-react';

export default function RightPanel({ activeTelemetry, robot, gapAnalysis }) {
  if (!robot) return null;

  return (
    <div className="panel right-panel">
      <h2><Activity size={24} color="var(--accent-blue)" /> Live Telemetry</h2>
      
      <div className="section-label">System Status</div>
      <div className="card">
        <div className="status-row">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Battery size={16} color="var(--accent-blue)" /> Battery
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

      {gapAnalysis && (
        <>
          <div className="section-label">AEGIS Gap Analysis</div>
          <div className="card" style={{ borderLeft: '4px solid var(--accent-red)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-red)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              <ShieldAlert size={18} /> ACTION: {gapAnalysis.status}
            </div>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>{gapAnalysis.reason}</p>
            
            <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-blue)', fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <Cpu size={16} /> {gapAnalysis.recommendation}
              </div>
              <div style={{ fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Chassis:</span>
                  <span>{gapAnalysis.specs.chassis}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Gait:</span>
                  <span>{gapAnalysis.specs.locomotion}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Payload:</span>
                  <span>{gapAnalysis.specs.payload}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

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

      <div className="section-label">Override Controls</div>
      <div className="card">
        <button className="btn" style={{ width: '100%', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Settings size={16} /> Deploy Sensor Array
        </button>
        <button className="btn btn-primary" style={{ width: '100%' }}>
          Override Manual Link
        </button>
      </div>
    </div>
  );
}
