import React, { useRef, useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';

export const Preview: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { currentTime, isPlaying, clips, setCurrentTime } = useEditorStore();

  // Handle play/pause state
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.currentTime = currentTime;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Playback failed:", error);
          });
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, currentTime]);

  // Keep the store's currentTime in sync with video playback
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setCurrentTime(video.currentTime);
  };

  const currentVideoClip = clips.find(
    clip => clip.type === 'video' && 
    currentTime >= clip.position && 
    currentTime <= clip.position + clip.duration
  );

  return (
    <div className="bg-black rounded-lg overflow-hidden aspect-video h-[60vh]">
      {currentVideoClip ? (
        <video
          ref={videoRef}
          src={URL.createObjectURL(currentVideoClip.file)}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => {
            setCurrentTime(currentVideoClip.position + currentVideoClip.duration);
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          No video clip at current time
        </div>
      )}
    </div>
  );
}; 