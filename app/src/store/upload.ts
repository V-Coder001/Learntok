import { create } from 'zustand';

import type { ClipStyle, UploadSource, Visibility } from '@/services/types';

// Entwurf des Upload-Formulars. Bleibt erhalten, bis der Clip abgeschickt wurde.
interface UploadDraft {
  source: UploadSource | null;
  style: ClipStyle;
  visibility: Visibility;
  rightsConfirmed: boolean;
  setSource: (source: UploadSource | null) => void;
  setStyle: (style: ClipStyle) => void;
  setVisibility: (visibility: Visibility) => void;
  setRightsConfirmed: (confirmed: boolean) => void;
  reset: () => void;
}

const initial = {
  source: null,
  style: 'short' as ClipStyle,
  visibility: 'private' as Visibility,
  rightsConfirmed: false,
};

export const useUploadDraft = create<UploadDraft>()((set) => ({
  ...initial,
  setSource: (source) => set({ source }),
  setStyle: (style) => set({ style }),
  setVisibility: (visibility) => set({ visibility }),
  setRightsConfirmed: (rightsConfirmed) => set({ rightsConfirmed }),
  reset: () => set(initial),
}));
