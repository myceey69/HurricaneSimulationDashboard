import React from 'react';
import { Layers, Crosshair, Map, Filter, RadioReceiver } from 'lucide-react';
import NanoBanana from './NanoBanana';

export default function LeftPanel({
  activeRobot,
  setActiveRobot,
  robots,
  layers,
  toggleLayer
}) {
  return (
    <div className="panel left-panel">
      <h2><RadioReceiver size={24} color="var(--accent-blue)" /> Mission Control</h2>
      
      <div className="section-label">Select Unit</div>
      <div className="card" style={{ padding: '0.5rem' }}>
        {robots.map(r => (
          <div 
            key={r.id}
            onClick={() => setActiveRobot(r.id)}
            style={{ 
              padding: '0.75rem', 
              cursor: 'pointer',
              borderRadius: '8px',
              background: activeRobot === r.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
              border: activeRobot === r.id ? '1px solid var(--accent-blue)' : '1px solid transparent',
              marginBottom: '0.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{r.id}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{r.type}</div>
            </div>
            <div className={`badge badge-${r.status}`}>{r.status}</div>
          </div>
        ))}
      </div>

      <div className="section-label">Map Layers</div>
      <div className="card">
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={layers.plannedRoute} 
            onChange={() => toggleLayer('plannedRoute')}
            style={{ accentColor: 'var(--accent-blue)' }}
          />
          <Map size={18} /> Planned Route
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={layers.hazards} 
            onChange={() => toggleLayer('hazards')}
            style={{ accentColor: 'var(--accent-red)' }}
          />
          <Filter size={18} /> Hazard Markers
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={layers.floodZones} 
            onChange={() => toggleLayer('floodZones')}
            style={{ accentColor: 'var(--accent-blue)' }}
          />
          <Layers size={18} /> Flood Zones
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={layers.targets} 
            onChange={() => toggleLayer('targets')}
            style={{ accentColor: 'var(--accent-green)' }}
          />
          <Crosshair size={18} /> Targets (Civilians/Supply)
        </label>
      </div>

      <div className="section-label">AI Tools</div>
      <NanoBanana />

      <div style={{ marginTop: 'auto' }}>
        <button className="btn btn-primary" onClick={() => alert("Mission start initialized")}>
          Initiate Selected Mission
        </button>
      </div>
    </div>
  );
}
