// MyVideo.tsx
import { Composition, staticFile, useCurrentFrame, interpolate } from 'remotion';

export const MyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <div style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
      <h1 style={{ fontSize: 80, opacity }}>Hello Remotion!</h1>
    </div>
  );
};
