import { create } from 'zustand';
import { TimelineRow } from '@xzdarcy/react-timeline-editor';

interface Clip {
  id: string;
  start: number; // in seconds
  end: number; // in seconds
  speed: number; // 1.0 is normal speed
}

interface IRStore {
  clips: Clip[];
  addClip: (clip: Clip) => void;
  updateClip: (id: string, updatedClip: Partial<Clip>) => void;
  removeClip: (id: string) => void;
  convertToTimelineRows: () => TimelineRow[];
}

export const useIRStore = create<IRStore>((set, get) => ({
  clips: [],

  addClip: (clip: Clip) => set((state) => ({
    clips: [...state.clips, clip],
  })),

  updateClip: (id, updatedClip) => set((state) => ({
    clips: state.clips.map((clip) =>
      clip.id === id ? { ...clip, ...updatedClip } : clip
    ),
  })),

  removeClip: (id) => set((state) => ({
    clips: state.clips.filter((clip) => clip.id !== id),
  })),

  convertToTimelineRows: () => {
    return get().clips.map((clip) => ({
      id: clip.id,
      actions: [
        {
          id: `action-${clip.id}`,
          start: clip.start,
          end: clip.end,
          effectId: `effect-${clip.id}`,
        },
      ],
    }));
  },
})); 