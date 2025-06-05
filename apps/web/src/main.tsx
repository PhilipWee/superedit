import React from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@remotion/player";
import { MyVideo } from './MyVideo';
import { FileUpload } from './components/FileUpload';
import "./styles.css";

const App = () => (
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
        {/* Timeline/NLE will go here */}
        <div className="h-full flex items-center justify-center text-gray-500">
          Timeline/NLE Section
        </div>
      </div>
    </div>
  </div>
);

createRoot(document.getElementById("app")!).render(<App />);
