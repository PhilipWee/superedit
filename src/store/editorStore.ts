import { create } from 'zustand';

interface MediaClip {
  id: string;
  type: 'video' | 'audio';
  file: File;
  startTime: number;
  endTime: number;
  position: number;
  duration: number;
}

interface EditorState {
  clips: MediaClip[];
  currentTime: number;
  isPlaying: boolean;
  addClip: (clip: MediaClip) => void;
  removeClip: (id: string) => void;
  updateClip: (id: string, updates: Partial<MediaClip>) => void;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  clips: [],
  currentTime: 0,
  isPlaying: false,
  
  addClip: (clip) => set((state) => ({
    clips: [...state.clips, clip]
  })),
  
  removeClip: (id) => set((state) => ({
    clips: state.clips.filter(clip => clip.id !== id)
  })),
  
  updateClip: (id, updates) => set((state) => ({
    clips: state.clips.map(clip => 
      clip.id === id ? { ...clip, ...updates } : clip
    )
  })),
  
  setCurrentTime: (time) => set({ currentTime: time }),
  setIsPlaying: (isPlaying) => set({ isPlaying })
})); 