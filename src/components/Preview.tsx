import React, { useRef, useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';

export const Preview: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { currentTime, isPlaying, clips } = useEditorStore();

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

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
          onTimeUpdate={(e) => {
            const video = e.currentTarget;
            if (video.currentTime >= currentVideoClip.endTime) {
              video.pause();
            }
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