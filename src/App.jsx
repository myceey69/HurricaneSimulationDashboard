import React, { useState, useEffect } from 'react';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import BottomTimeline from './components/BottomTimeline';
import MapArea from './components/MapArea';
import JarvisCore from './components/JarvisCore';
import MissionAmbienceController from './components/MissionAmbienceController';
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

  const toggleLayer = (layerName, forceValue) => {
    setLayers(prev => ({ 
      ...prev, 
      [layerName]: forceValue !== undefined ? forceValue : !prev[layerName] 
    }));
  };

  // Jarvis command handlers
  const handleJarvisLayerToggle = (layerName, show) => {
    toggleLayer(layerName, show);
  };

  const handleJarvisRobotSelect = (robotId) => {
    setActiveRobot(robotId);
  };

  const handleJarvisPlaybackControl = (action) => {
    switch (action) {
      case 'play':
        setIsPlaying(true);
        break;
      case 'pause':
        setIsPlaying(false);
        break;
      case 'restart':
        setProgress(0);
        setIsPlaying(false);
        break;
      case 'speedUp':
        setPlaybackScale(prev => Math.min(prev * 2, 8));
        break;
      case 'slowDown':
        setPlaybackScale(prev => Math.max(prev / 2, 0.25));
        break;
    }
  };

  const handleJarvisGapAnalysis = () => {
    // Trigger gap analysis from LeftPanel
    setIsPooling(false);
    // This would normally trigger the gap analysis flow
    console.log('Gap analysis triggered via Jarvis');
  };

  const handleJarvisResourcePool = () => {
    setIsPooling(true);
  };

  const handleJarvisStatusReport = () => {
    // Return current status for voice report
    return {
      activeRobots: MOCK_ROBOTS.filter(r => r.status === 'active').length,
      totalRobots: MOCK_ROBOTS.length,
      progress: progress,
      totalSteps: totalSteps,
      isPlaying: isPlaying
    };
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

      <JarvisCore
        onLayerToggle={handleJarvisLayerToggle}
        onRobotSelect={handleJarvisRobotSelect}
        onPlaybackControl={handleJarvisPlaybackControl}
        onGapAnalysis={handleJarvisGapAnalysis}
        onResourcePool={handleJarvisResourcePool}
        onStatusReport={handleJarvisStatusReport}
        robots={MOCK_ROBOTS}
        currentStatus={{
          activeRobots: MOCK_ROBOTS.filter(r => r.status === 'active').length,
          totalRobots: MOCK_ROBOTS.length,
          progress: progress,
          totalSteps: totalSteps,
          isPlaying: isPlaying,
          currentRobot: activeRobotData
        }}
      />

      <MissionAmbienceController
        missionState={{
          isPlaying: isPlaying,
          progress: progress,
          totalSteps: totalSteps,
          activeTelemetry: activeTelemetry,
          activeRobot: activeRobotData,
          criticalAlerts: activeTelemetry?.systemHealth < 50 ? 1 : 0,
          missionComplete: progress >= totalSteps - 1 && !isPlaying
        }}
        enabled={import.meta.env.VITE_ENABLE_LYRIA === 'true'}
      />
    </div>
  );
}
