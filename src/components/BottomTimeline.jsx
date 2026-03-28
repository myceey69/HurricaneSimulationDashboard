import React from 'react';
import { Play, Pause, FastForward, Rewind, Clock } from 'lucide-react';

export default function BottomTimeline({
  isPlaying,
  setIsPlaying,
  playbackScale,
  setPlaybackScale,
  progress,
  setProgress,
  totalSteps,
  currentTime
}) {
  const handleScaleChange = () => {
    const scales = [1, 2, 5, 10];
    const currentIndex = scales.indexOf(playbackScale);
    setPlaybackScale(scales[(currentIndex + 1) % scales.length]);
  };

  return (
    <div className="bottom-timeline">
      <div className="timeline-controls">
        <button className="btn" style={{ padding: '0.6rem' }} onClick={() => setProgress(0)}>
          <Rewind size={18} />
        </button>
        <button 
          className="btn btn-primary" 
          style={{ padding: '0.6rem' }}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
        </button>
        <button className="btn" style={{ padding: '0.6rem' }} onClick={handleScaleChange}>
          <FastForward size={18} /> {playbackScale}x
        </button>
      </div>

      <div className="timeline-slider-container">
        <div className="time-readout">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={16} /> Mission Timeline
          </span>
          <span>{new Date(currentTime).toLocaleTimeString()}</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max={totalSteps - 1} 
          value={progress}
          onChange={(e) => {
            setProgress(parseInt(e.target.value));
            if (isPlaying) setIsPlaying(false);
          }}
        />
      </div>
    </div>
  );
}
