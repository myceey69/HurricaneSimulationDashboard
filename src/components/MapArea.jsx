import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Polygon, Tooltip, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MOCK_HAZARDS, PLANNED_PATH, MOCK_TARGETS, FLOOD_ZONES } from '../data/mockData';
import { RadioReceiver, AlertOctagon, Target } from 'lucide-react';

// Custom icons using Lucide as HTML
export const createCustomIcon = (iconColor) => L.divIcon({
  className: 'custom-icon',
  html: `<div class="robot-marker" style="border-color: ${iconColor}; box-shadow: 0 0 15px ${iconColor}80;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10 10 10 0 0 1-10-10A10 10 0 0 1 12 2Z"/></svg></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

export const hazardIcon = L.divIcon({
  className: 'custom-hazard',
  html: `<div class="hazard-marker"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/></svg></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

export const targetIcon = L.divIcon({
  className: 'custom-target',
  html: `<div style="color: var(--accent-green); filter: drop-shadow(0 0 5px var(--accent-green));"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

export default function MapArea({ layers, activeRobotData, robots, activeTelemetry, pathHistory }) {
  const position = [29.7624, -95.3688]; // Houston center

  return (
    <div className="map-area">
      <MapContainer 
        center={position} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          className="dark-map-tiles"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />

        {/* Flood Zones */}
        {layers.floodZones && FLOOD_ZONES.map(fz => (
          <Polygon 
            key={fz.id} 
            positions={fz.polygon}
            pathOptions={{ 
              color: fz.depth === 'severe' ? '#1d4ed8' : '#3b82f6',
              fillColor: fz.depth === 'severe' ? '#1e3a8a' : '#60a5fa',
              fillOpacity: 0.4,
              weight: 1
            }}
          >
            <Tooltip>Flood Zone: {fz.depth}</Tooltip>
          </Polygon>
        ))}

        {/* Planned Route */}
        {layers.plannedRoute && (
          <Polyline 
            positions={PLANNED_PATH}
            pathOptions={{ color: 'var(--accent-blue)', weight: 4, opacity: 0.6, dashArray: '8, 8' }}
          />
        )}

        {/* Actual Path / History for Alpha */}
        {pathHistory.length > 0 && (
          <Polyline 
            positions={pathHistory}
            pathOptions={{ color: 'var(--accent-green)', weight: 5, opacity: 0.9 }}
          />
        )}

        {/* Targets Layer */}
        {layers.targets && MOCK_TARGETS.map(t => (
          <Marker key={t.id} position={[t.lat, t.lng]} icon={targetIcon}>
            <Tooltip>{t.type}: {t.count}</Tooltip>
          </Marker>
        ))}

        {/* Hazards Layer */}
        {layers.hazards && MOCK_HAZARDS.map(h => (
          <Marker key={h.id} position={[h.lat, h.lng]} icon={hazardIcon}>
            <Tooltip direction="top">Hazard: {h.type} ({h.severity})</Tooltip>
          </Marker>
        ))}

        {/* Other Robots (offline/idle) */}
        {robots.filter(r => r.id !== activeRobotData?.id).map(r => (
          <Marker 
            key={r.id} 
            position={[r.lat, r.lng]} 
            icon={createCustomIcon(
              r.status === 'offline' ? 'var(--text-secondary)' : 
              r.status === 'warning' ? 'var(--accent-orange)' : 'var(--text-primary)'
            )}
          >
             <Popup>{r.id} - {r.status}</Popup>
          </Marker>
        ))}

        {/* Active Robot Telemetry Marker */}
        {activeTelemetry && activeRobotData?.id === "RBT-Alpha" ? (
          <Marker 
            position={[activeTelemetry.lat, activeTelemetry.lng]} 
            icon={createCustomIcon('var(--accent-green)')}
          >
            <Tooltip direction="bottom" offset={[0, 15]} opacity={1} permanent>
              RBT-Alpha
            </Tooltip>
          </Marker>
        ) : (
          activeRobotData && (
            <Marker 
              position={[activeRobotData.lat, activeRobotData.lng]} 
              icon={createCustomIcon('var(--accent-blue)')}
            >
              <Tooltip direction="bottom" offset={[0, 15]} opacity={1} permanent>
                {activeRobotData.id}
              </Tooltip>
            </Marker>
          )
        )}
      </MapContainer>
    </div>
  );
}
