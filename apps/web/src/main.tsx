import React from "react";
import { createRoot } from "react-dom/client";
import typescriptLogo from "/typescript.svg";
import { Header, Counter } from "@repo/ui";
import { createRef } from "@motion-canvas/core";
import { Circle, makeScene2D, Video } from "@motion-canvas/2d";
import "./styles.css";

const video = makeScene2D(function* (view) {
  const circle = createRef<Circle>();
  const videoRef = createRef<Video>();

  const circleNode = new Circle({
    x: -700,
    size: 320,
    fill: "lightseagreen",
    ref: circle,
  });

  // const videoNode = new Video({
  //   src: exampleMp4,
  //   width: 800,
  //   height: 450,
  // });

  // videoNode.addRef(videoRef);

  view.add(circleNode);
  // view.add(videoNode);

  // videoRef().seek(3);
  // videoRef().play();

  yield* circle().scale(2, 2).to(1, 2);
});

const App = () => {
  console.log(video);

  return (
    <div className="h-screen w-screen bg-red-100">
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" className="logo" alt="Vite logo" />
      </a>
      <a href="https://www.typescriptlang.org/" target="_blank">
        ddd
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
};

createRoot(document.getElementById("app")!).render(<App />);
