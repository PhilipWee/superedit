import React, { useRef, useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';

interface TimelineProps {
  width: number;
}

const PIXELS_PER_SECOND = 50; // Increased for better visibility
const TRACK_HEIGHT = 64; // Standard track height

export const Timeline: React.FC<TimelineProps> = ({ width }) => {
  const { clips, currentTime, isPlaying, setCurrentTime } = useEditorStore();
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll timeline during playback
  useEffect(() => {
    const parentEl = timelineContainerRef.current;
    if (!parentEl) return;

    const updateScroll = () => {
      const currentPixelPosition = currentTime * PIXELS_PER_SECOND;
      const containerWidth = parentEl.offsetWidth;
      const scrollPosition = parentEl.scrollLeft;
      const margin = containerWidth * 0.2; // 20% margin

      // Check if playhead is getting close to the edge of the visible area
      if (currentPixelPosition < scrollPosition + margin || 
          currentPixelPosition > scrollPosition + containerWidth - margin) {
        // Center the playhead
        const targetScroll = Math.max(0, currentPixelPosition - containerWidth / 2);
        parentEl.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
      }
    };

    if (isPlaying) {
      updateScroll();
    }
  }, [currentTime, isPlaying]);

  const handleRulerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (timelineContainerRef.current) {
      const containerRect = timelineContainerRef.current.getBoundingClientRect();
      const clickXInContainer = event.clientX - containerRect.left;
      const newTime = (clickXInContainer + timelineContainerRef.current.scrollLeft) / PIXELS_PER_SECOND;
      setCurrentTime(Math.max(0, newTime));
    }
  };

  const totalTimelineDuration = Math.max(
    width / PIXELS_PER_SECOND,
    ...clips.map(clip => clip.position + clip.duration),
    10
  );
  const rulerWidth = totalTimelineDuration * PIXELS_PER_SECOND;

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 select-none shadow-xl">
      <div className="flex flex-col gap-2">
        {/* Video Track */}
        <div className="bg-gray-800/50 rounded-lg overflow-hidden">
          <div className="px-2 py-1 bg-gray-800 text-xs font-medium text-gray-400">Video Track</div>
          <div className="relative" style={{ height: TRACK_HEIGHT }}>
            <div className="absolute inset-0" style={{ width: `${rulerWidth}px` }}>
              {clips
                .filter(clip => clip.type === 'video')
                .map(clip => (
                  <div
                    key={clip.id}
                    className="absolute top-1 bottom-1 bg-blue-600/90 rounded-md cursor-move shadow-lg 
                             hover:bg-blue-500/90 transition-colors duration-150"
                    style={{
                      width: `${Math.max(PIXELS_PER_SECOND / 2, clip.duration * PIXELS_PER_SECOND)}px`,
                      left: `${clip.position * PIXELS_PER_SECOND}px`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center p-2">
                      <span className="text-xs font-medium text-white truncate">{clip.file.name}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Audio Track */}
        <div className="bg-gray-800/50 rounded-lg overflow-hidden">
          <div className="px-2 py-1 bg-gray-800 text-xs font-medium text-gray-400">Audio Track</div>
          <div className="relative" style={{ height: TRACK_HEIGHT }}>
            <div className="absolute inset-0" style={{ width: `${rulerWidth}px` }}>
              {clips
                .filter(clip => clip.type === 'audio')
                .map(clip => (
                  <div
                    key={clip.id}
                    className="absolute top-1 bottom-1 bg-green-600/90 rounded-md cursor-move shadow-lg
                             hover:bg-green-500/90 transition-colors duration-150"
                    style={{
                      width: `${Math.max(PIXELS_PER_SECOND / 2, clip.duration * PIXELS_PER_SECOND)}px`,
                      left: `${clip.position * PIXELS_PER_SECOND}px`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center p-2">
                      <span className="text-xs font-medium text-white truncate">{clip.file.name}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Timeline Ruler */}
        <div
          ref={timelineContainerRef}
          className="h-8 bg-gray-800/80 rounded-lg overflow-x-auto relative mt-1 cursor-pointer"
          style={{ width: `${width}px` }}
          onClick={handleRulerClick}
        >
          <div
            ref={rulerRef}
            className="h-full flex items-end relative"
            style={{ width: `${rulerWidth}px` }}
          >
            {/* Major time markers (every second) */}
            {Array.from({ length: Math.ceil(totalTimelineDuration) + 1 }).map((_, sec) => (
              <div
                key={sec}
                className="relative h-full border-r border-gray-700"
                style={{ width: `${PIXELS_PER_SECOND}px` }}
              >
                <span className="absolute -top-0 left-1 text-[10px] font-medium text-gray-500">
                  {formatTime(sec)}
                </span>
                {/* Minor tick marks (quarters) */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-2 border-r border-gray-700"
                    style={{
                      left: `${(i + 1) * (PIXELS_PER_SECOND / 4)}px`,
                      bottom: 0,
                    }}
                  />
                ))}
              </div>
            ))}
            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 pointer-events-none"
              style={{ left: `${currentTime * PIXELS_PER_SECOND}px` }}
            >
              <div className="absolute -top-1 -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45" />
              <div className="absolute top-0 bottom-0 w-px bg-red-500" />
              <div className="absolute -bottom-4 -translate-x-1/2 bg-black/80 text-white px-1.5 py-0.5 rounded text-xs whitespace-nowrap">
                {formatTime(currentTime)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 