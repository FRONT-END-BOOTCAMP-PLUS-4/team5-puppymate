import { create } from 'zustand';

interface RouteState {
  points: Array<{ lat: number; lng: number }>;
  isTracking: boolean;
  addPoint: (point: { lat: number; lng: number }) => void;
  startTracking: () => void;
  stopTracking: () => void;
}

export const useRouteStore = create<RouteState>((set) => ({
  points: [],
  isTracking: false,
  addPoint: (point) => set((state) => ({ 
    points: [...state.points, point] 
  })),
  startTracking: () => set({ isTracking: true }),
  stopTracking: () => set({ isTracking: false }),
})); 