import React, { useState, useEffect } from 'react';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import BottomTimeline from './components/BottomTimeline';
import MapArea from './components/MapArea';
import { MOCK_ROBOTS, MOCK_TELEMETRY } from './data/mockData';

export default function App() {
  const [activeRobot, setActiveRobot] = useState(MOCK_ROBOTS[0].id);
  const [layers, setLayers] = useState({
    plannedRoute: true,
    hazards: true,
    floodZones: true,
    targets: true
  });

  // Replay State
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // index in MOCK_TELEMETRY
  const [playbackScale, setPlaybackScale] = useState(1);
  const totalSteps = MOCK_TELEMETRY.length;

  useEffect(() => {
    let interval;
    if (isPlaying && progress < totalSteps - 1) {
      interval = setInterval(() => {
        setProgress(p => (p + 1 < totalSteps ? p + 1 : p));
      }, 1000 / playbackScale);
    } else if (progress >= totalSteps - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress, playbackScale, totalSteps]);

  const toggleLayer = (layerName) => {
    setLayers(prev => ({ flex: prev, ...prev, [layerName]: !prev[layerName] }));
  };

  const activeRobotData = MOCK_ROBOTS.find(r => r.id === activeRobot);
  const activeTelemetry = activeRobot === "RBT-Alpha" && MOCK_TELEMETRY[progress] 
    ? MOCK_TELEMETRY[progress] 
    : null;

  const pathHistory = activeRobot === "RBT-Alpha" 
    ? MOCK_TELEMETRY.slice(0, progress + 1).map(step => [step.lat, step.lng])
    : [];

  const currentTime = activeTelemetry ? activeTelemetry.timestamp : new Date().getTime();

  return (
    <div className="dashboard-layout">
      <LeftPanel 
        activeRobot={activeRobot} 
        setActiveRobot={setActiveRobot} 
        robots={MOCK_ROBOTS}
        layers={layers}
        toggleLayer={toggleLayer}
      />
      
      <MapArea 
        layers={layers}
        activeRobotData={activeRobotData}
        robots={MOCK_ROBOTS}
        activeTelemetry={activeTelemetry}
        pathHistory={pathHistory}
      />

      <RightPanel 
        activeTelemetry={activeTelemetry}
        robot={activeRobotData}
      />

      <BottomTimeline 
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        playbackScale={playbackScale}
        setPlaybackScale={setPlaybackScale}
        progress={progress}
        setProgress={setProgress}
        totalSteps={totalSteps}
        currentTime={currentTime}
      />
    </div>
  );
}
