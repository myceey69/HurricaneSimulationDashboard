import React, { useState, useEffect } from 'react';
import LyriaAudioEngine from './LyriaAudioEngine';
import { Music, Volume1, Volume2 } from 'lucide-react';
import './MissionAmbienceController.css';

const MissionAmbienceController = ({ missionState, enabled: initialEnabled = false }) => {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [volume, setVolume] = useState(0.6);
  const [currentTheme, setCurrentTheme] = useState('planning');
  const [manualControl, setManualControl] = useState(false);

  const lyriaEngine = LyriaAudioEngine({
    enabled: enabled,
    theme: currentTheme,
    onError: (error) => {
      console.error('Lyria engine error:', error);
    },
    onReady: () => {
      console.log('Lyria audio engine ready');
    }
  });

  // Auto-detect mission theme based on state
  useEffect(() => {
    if (!enabled || manualControl) return;

    let newTheme = 'planning';

    // Determine theme from mission state
    if (missionState?.isPlaying) {
      newTheme = 'deployment';
    }

    if (missionState?.criticalAlerts && missionState.criticalAlerts > 0) {
      newTheme = 'critical';
    }

    if (missionState?.emergencyMode) {
      newTheme = 'emergency';
    }

    if (missionState?.missionComplete) {
      newTheme = 'success';
    }

    // Check telemetry for risk conditions
    if (missionState?.activeTelemetry) {
      const telemetry = missionState.activeTelemetry;
      if (telemetry.batteryLevel < 20 || telemetry.systemHealth < 50) {
        newTheme = 'critical';
      }
    }

    if (newTheme !== currentTheme) {
      setCurrentTheme(newTheme);
    }
  }, [missionState, enabled, manualControl, currentTheme]);

  const toggleMusic = async () => {
    if (!enabled) {
      setEnabled(true);
      // Small delay to allow state to update
      setTimeout(() => {
        lyriaEngine.connect();
      }, 100);
    } else {
      lyriaEngine.disconnect();
      setEnabled(false);
    }
  };

  const handleThemeChange = (theme) => {
    setManualControl(true);
    setCurrentTheme(theme);
    lyriaEngine.changeTheme(theme);
    
    // Re-enable auto after 2 minutes
    setTimeout(() => {
      setManualControl(false);
    }, 120000);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    // Note: Web Audio API volume control would be added to LyriaAudioEngine
  };

  const themeLabels = {
    planning: { label: 'Calm', icon: '🧘', color: '#3b82f6' },
    deployment: { label: 'Active', icon: '🚀', color: '#10b981' },
    critical: { label: 'Tense', icon: '⚠️', color: '#f59e0b' },
    emergency: { label: 'Urgent', icon: '🚨', color: '#ef4444' },
    success: { label: 'Victory', icon: '🎉', color: '#8b5cf6' }
  };

  return (
    <div className="ambience-controller">
      <div className="ambience-header">
        <button 
          className={`ambience-toggle ${enabled ? 'active' : ''}`}
          onClick={toggleMusic}
          title={enabled ? 'Disable mission music' : 'Enable mission music'}
        >
          {enabled ? <Music size={20} /> : <Music size={20} style={{ opacity: 0.5 }} />}
          <span>Mission Ambience</span>
        </button>
        
        {enabled && (
          <div className={`theme-indicator theme-${currentTheme}`}>
            <span className="theme-icon">{themeLabels[currentTheme]?.icon}</span>
            <span className="theme-label">{themeLabels[currentTheme]?.label}</span>
            {manualControl && <span className="manual-badge">Manual</span>}
          </div>
        )}
      </div>

      {enabled && (
        <div className="ambience-controls">
          <div className="theme-selector">
            <div className="theme-label-text">Theme:</div>
            <div className="theme-buttons">
              {lyriaEngine.availableThemes?.map(theme => (
                <button
                  key={theme}
                  className={`theme-btn ${currentTheme === theme ? 'active' : ''}`}
                  onClick={() => handleThemeChange(theme)}
                  title={themeLabels[theme]?.label}
                  style={{
                    borderColor: currentTheme === theme ? themeLabels[theme]?.color : undefined
                  }}
                >
                  <span className="theme-btn-icon">{themeLabels[theme]?.icon}</span>
                  <span className="theme-btn-label">{themeLabels[theme]?.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="volume-control">
            <Volume1 size={16} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
            <Volume2 size={16} />
            <span className="volume-value">{Math.round(volume * 100)}%</span>
          </div>

          <div className="ambience-status">
            <div className={`status-dot ${lyriaEngine.isConnected ? 'connected' : 'disconnected'}`} />
            <span className="status-text">
              {lyriaEngine.isConnected 
                ? lyriaEngine.isPlaying ? 'Playing' : 'Connected' 
                : 'Connecting...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionAmbienceController;
