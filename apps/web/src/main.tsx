import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@remotion/player";
import { MyVideo } from './MyVideo';
import { FileUpload } from './components/FileUpload';
import { Timeline, TimelineEffect, TimelineRow } from '@xzdarcy/react-timeline-editor';
import { useIRStore } from './store/irStore';
import "./styles.css";

const mockEffect: Record<string, TimelineEffect> = {
  effect0: {
    id: "effect0",
    name: "Effect 0",
  },
  effect1: {
    id: "effect1",
    name: "Effect 1",
  },
};

const App = () => {
  const { clips, convertToTimelineRows, updateClip } = useIRStore();

  useEffect(() => {
    // Sync timeline rows with IR
    const timelineRows = convertToTimelineRows();
    // Update timeline rows if needed
  }, [clips, convertToTimelineRows]);

  return (
    <div className="h-screen w-screen bg-gray-100 p-4">
      <div className="h-full grid grid-rows-[2fr,1fr] gap-4">
        {/* Top section - split into two columns */}
        <div className="grid grid-cols-2 gap-4">
          {/* File upload section - top left */}
          <div className="bg-white rounded-lg shadow-md overflow-auto">
            <FileUpload />
          </div>
          
          {/* Preview section - top right */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <Player
              component={MyVideo}
              durationInFrames={90}
              compositionWidth={1280}
              compositionHeight={720}
              fps={30}
              controls
              autoPlay
            />
          </div>
        </div>

        {/* NLE section - bottom full width */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <Timeline
            editorData={convertToTimelineRows()}
            effects={mockEffect}
            onChange={(newData) => {
              newData.forEach(row => {
                const action = row.actions[0];
                updateClip(row.id, { start: action.start, end: action.end });
              });
            }}
            style={{ height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

createRoot(document.getElementById("app")!).render(<App />);
