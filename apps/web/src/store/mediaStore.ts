import { create } from 'zustand'

interface TimeSegment {
  startTime: number  // in seconds
  endTime: number    // in seconds
  label: string
  aiGenerated: boolean
}

interface MediaItem {
  id: string
  name: string
  url: string
  type: string  // 'video' | 'audio' | 'image'
  created_at: string
  segments: TimeSegment[]
  aiProcessed: boolean
}

interface MediaStore {
  mediaItems: Record<string, MediaItem>
  currentMediaId: string | null
  // Actions
  addMedia: (media: Omit<MediaItem, 'segments' | 'aiProcessed'>) => void
  removeMedia: (id: string) => void
  addSegment: (mediaId: string, segment: TimeSegment) => void
  removeSegment: (mediaId: string, index: number) => void
  setCurrentMedia: (id: string | null) => void
  updateAiProcessed: (mediaId: string, processed: boolean) => void
}

export const useMediaStore = create<MediaStore>((set) => ({
  mediaItems: {},
  currentMediaId: null,

  addMedia: (media) => set((state) => ({
    mediaItems: {
      ...state.mediaItems,
      [media.id]: {
        ...media,
        segments: [],
        aiProcessed: false
      }
    }
  })),

  removeMedia: (id) => set((state) => {
    const { [id]: removed, ...rest } = state.mediaItems
    return { mediaItems: rest }
  }),

  addSegment: (mediaId, segment) => set((state) => ({
    mediaItems: {
      ...state.mediaItems,
      [mediaId]: {
        ...state.mediaItems[mediaId],
        segments: [...state.mediaItems[mediaId].segments, segment]
      }
    }
  })),

  removeSegment: (mediaId, index) => set((state) => ({
    mediaItems: {
      ...state.mediaItems,
      [mediaId]: {
        ...state.mediaItems[mediaId],
        segments: state.mediaItems[mediaId].segments.filter((_, i) => i !== index)
      }
    }
  })),

  setCurrentMedia: (id) => set({ currentMediaId: id }),

  updateAiProcessed: (mediaId, processed) => set((state) => ({
    mediaItems: {
      ...state.mediaItems,
      [mediaId]: {
        ...state.mediaItems[mediaId],
        aiProcessed: processed
      }
    }
  }))
})) 