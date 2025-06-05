import React from "react";
import { createRoot } from "react-dom/client";
import typescriptLogo from "/typescript.svg";
import { Player } from "@remotion/player";
import { Header, Counter } from "@repo/ui";
import { MyVideo } from './MyVideo';
import "./styles.css";

const App = () => (
  <div className="h-screen w-screen bg-red-100">
    <Player
      component={MyVideo}
      durationInFrames={90}
      compositionWidth={1280}
      compositionHeight={720}
      fps={30}
      controls
      autoPlay
    />
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" className="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img
        src={typescriptLogo}
        className="logo vanilla"
        alt="TypeScript logo"
      />
    </a>
    <Header title="Web" />
    <div className="card">
      <Counter />
    </div>
  </div>
);

createRoot(document.getElementById("app")!).render(<App />);
