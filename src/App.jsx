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
    targets: true,
    resources: true
  });

  // AEGIS State
  const [isPooling, setIsPooling] = useState(false);
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);

  // Replay State
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); 
  const [playbackScale, setPlaybackScale] = useState(1);
  const totalSteps = MOCK_TELEMETRY.length;

  useEffect(() => {
    let interval;
    if (isPlaying && progress < totalSteps - 1) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p + 1 < totalSteps) {
            return p + 1;
          } else {
            setIsPlaying(false);
            return p;
          }
        });
      }, 1000 / playbackScale);
    } 
    return () => clearInterval(interval);
  }, [isPlaying, progress, playbackScale, totalSteps]);

  const toggleLayer = (layerName) => {
    setLayers(prev => ({ ...prev, [layerName]: !prev[layerName] }));
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
        isPooling={isPooling}
        setIsPooling={setIsPooling}
        setGapAnalysis={setGapAnalysis}
        gapAnalysis={gapAnalysis}
        generatedImage={generatedImage}
        setGeneratedImage={setGeneratedImage}
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
        gapAnalysis={gapAnalysis}
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
