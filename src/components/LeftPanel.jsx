import React, { useState } from 'react';
import { Layers, Crosshair, Map, Filter, RadioReceiver, Database, Zap, AlertTriangle } from 'lucide-react';
import AegisHardwareArchitect from './AegisHardwareArchitect';
import AegisVeoSimulation from './AegisVeoSimulation';

export default function LeftPanel({
  activeRobot,
  setActiveRobot,
  robots,
  layers,
  toggleLayer,
  isPooling,
  setIsPooling,
  setGapAnalysis
}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const poolResources = () => {
    setIsPooling(true);
    setTimeout(() => {
      alert("Multimodal Resource Fusion Complete: USAR TF1, WHO Drone Team, and FEMA assets synced.");
      setIsPooling(false);
    }, 1500);
  };

  const identifyGap = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const scenarios = [
        {
          status: "Veto",
          reason: "98% Soil Saturation detected in Sector 7. Existing wheeled robots (RBT-Bravo) will fail.",
          recommendation: "Mud-Runner Hexapod",
          specs: {
            chassis: "Sealed IP68 Elevated",
            locomotion: "Variable-Gait Hexapod",
            payload: "40lbs Water/Med-kit"
          }
        },
        {
          status: "Veto",
          reason: "Hydrodynamic Velocity exceeding 5m/s in Urban Grid. Standard SAR boats will snag on debris.",
          recommendation: "Urban-Skimmer Fan-Bot",
          specs: {
            chassis: "Low-Draft Carbon Fiber",
            locomotion: "Dual-Fan Propelled",
            payload: "Emergency Beacon Array"
          }
        },
        {
          status: "Veto",
          reason: "Total Soil Liquefaction in Appalachian Terrain. Tracked robots (RBT-Bravo) are too heavy.",
          recommendation: "Aero-Lift Cargo Drone",
          specs: {
            chassis: "Titanium Alloy Exoskeleton",
            locomotion: "Octo-Rotor VTOL",
            payload: "Heavy-Duty Battery Cells"
          }
        }
      ];
      
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      setGapAnalysis(randomScenario);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="panel left-panel">
      <h2><Zap size={24} color="var(--accent-blue)" /> AEGIS Ops</h2>
      
      <div className="section-label">Mission Intelligence</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
        <button 
          className="btn btn-primary" 
          onClick={poolResources}
          disabled={isPooling}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.75rem' }}
        >
          <Database size={14} /> {isPooling ? "Pooling..." : "Pool Resources"}
        </button>
        <button 
          className="btn" 
          onClick={identifyGap}
          disabled={isAnalyzing}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem', 
            fontSize: '0.75rem',
            background: 'var(--accent-red)',
            color: 'white'
          }}
        >
          <AlertTriangle size={14} /> {isAnalyzing ? "Analyzing..." : "Identify Gap"}
        </button>
      </div>

      <div className="section-label">Active Units</div>
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

      <div className="section-label">Strategic Layers</div>
      <div className="card">
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={layers.plannedRoute} 
            onChange={() => toggleLayer('plannedRoute')}
            style={{ accentColor: 'var(--accent-blue)' }}
          />
          <Map size={18} /> Tactical Routes
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={layers.hazards} 
            onChange={() => toggleLayer('hazards')}
            style={{ accentColor: 'var(--accent-red)' }}
          />
          <Filter size={18} /> Hazard Analysis
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={layers.floodZones} 
            onChange={() => toggleLayer('floodZones')}
            style={{ accentColor: 'var(--accent-blue)' }}
          />
          <Layers size={18} /> Terrain Saturation
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={layers.targets} 
            onChange={() => toggleLayer('targets')}
            style={{ accentColor: 'var(--accent-green)' }}
          />
          <Crosshair size={18} /> Resource Gaps
        </label>
      </div>

      <div className="section-label">Generative Genesis (Nano)</div>
      <AegisHardwareArchitect gapAnalysis={gapAnalysis} />

      <div className="section-label">Veo Simulation (WOW)</div>
      <AegisVeoSimulation gapAnalysis={gapAnalysis} />
    </div>
  );
}
