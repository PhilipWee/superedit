import React, { useState } from 'react';
import { useMediaStore } from '../store/mediaStore';

interface MediaClipsProps {
  mediaId: string;
}

export const MediaClips: React.FC<MediaClipsProps> = ({ mediaId }) => {
  const { mediaItems, addSegment, removeSegment } = useMediaStore();
  const media = mediaItems[mediaId];
  
  const [newSegment, setNewSegment] = useState({
    startTime: '',
    endTime: '',
    label: '',
  });

  if (!media) return null;

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const parseTimeToSeconds = (timeStr: string): number => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  const handleAddSegment = () => {
    if (!newSegment.startTime || !newSegment.endTime || !newSegment.label) return;

    const startSeconds = parseTimeToSeconds(newSegment.startTime);
    const endSeconds = parseTimeToSeconds(newSegment.endTime);

    if (startSeconds >= endSeconds) {
      alert('End time must be after start time');
      return;
    }

    addSegment(mediaId, {
      startTime: startSeconds,
      endTime: endSeconds,
      label: newSegment.label,
      aiGenerated: false
    });

    setNewSegment({
      startTime: '',
      endTime: '',
      label: ''
    });
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Clips</h3>
      
      {/* Add new segment form */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="00:00"
          value={newSegment.startTime}
          onChange={(e) => setNewSegment(prev => ({ ...prev, startTime: e.target.value }))}
          className="border rounded px-2 py-1 w-20"
        />
        <input
          type="text"
          placeholder="00:00"
          value={newSegment.endTime}
          onChange={(e) => setNewSegment(prev => ({ ...prev, endTime: e.target.value }))}
          className="border rounded px-2 py-1 w-20"
        />
        <input
          type="text"
          placeholder="Description"
          value={newSegment.label}
          onChange={(e) => setNewSegment(prev => ({ ...prev, label: e.target.value }))}
          className="border rounded px-2 py-1 flex-1"
        />
        <button
          onClick={handleAddSegment}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* Segments list */}
      <div className="space-y-2">
        {media.segments.map((segment, index) => (
          <div
            key={index}
            className={`p-2 rounded border ${segment.aiGenerated ? 'bg-purple-50' : 'bg-gray-50'}`}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
              </span>
              <button
                onClick={() => removeSegment(mediaId, index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
            <p className="text-sm mt-1">{segment.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}; 