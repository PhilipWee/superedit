import { useState, useCallback } from 'react';
import { Timeline } from './components/Timeline';
import { Preview } from './components/Preview';
import { useEditorStore } from './store/editorStore';

function App() {
  const { addClip, setIsPlaying, isPlaying } = useEditorStore();
  const [timelineWidth] = useState(1200);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const type = file.type.startsWith('video/') ? 'video' as const : 'audio' as const;
      
      try {
        // Create a video/audio element to get duration
        const media = document.createElement(type === 'video' ? 'video' : 'audio');
        media.preload = 'metadata';
        
        // Create object URL for the file
        const objectUrl = URL.createObjectURL(file);
        media.src = objectUrl;
        
        // Wait for metadata to load
        await new Promise<void>((resolve, reject) => {
          media.onloadedmetadata = () => {
            if (media.duration === Infinity || isNaN(media.duration)) {
              reject(new Error('Could not determine media duration'));
              return;
            }
            
            const clip = {
              id: Math.random().toString(36).substr(2, 9),
              type,
              file,
              startTime: 0,
              endTime: media.duration,
              position: 0,
              duration: media.duration,
            };
            
            addClip(clip);
            URL.revokeObjectURL(objectUrl);
            resolve();
          };
          
          media.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Failed to load media file'));
          };
        });
      } catch (error) {
        console.error('Error loading media file:', error);
        // You might want to show this error to the user in a more friendly way
      }
    }
  }, [addClip]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">SuperEdit NLE</h1>
          <div className="space-x-4">
            <input
              type="file"
              accept="video/*,audio/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded cursor-pointer"
            >
              Upload Media
            </label>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
        </div>

        <Preview />

        <Timeline width={timelineWidth} />
      </div>
    </div>
  );
}

export default App;
