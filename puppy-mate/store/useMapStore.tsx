import { create } from 'zustand';
import { combine, devtools } from 'zustand/middleware';

export interface LatLng {
  lat: number;
  lng: number;
}

const useMapStore = create(
  devtools(
    combine(
      {
        coordinates: [] as LatLng[], // 초기 경로는 빈 배열
        isSavingCourse: false,
        startTime: 0,
      },
      (set, get) => {
        const addCoursePoint = (point: LatLng) => set((state) => ({ coordinates: [...state.coordinates, point] })); // 새로운 좌표 추가
        const clearCourse = () => set({ coordinates: [] }); // 경로 초기화
        const startRecordingCourse = () => set({ isSavingCourse: true, startTime: new Date().getTime() });
        const stopRecordingCourse = () => set({ isSavingCourse: false });

        return {
          addCoursePoint,
          clearCourse,
          startRecordingCourse,
          stopRecordingCourse,
        };
      }
    )
  )
);

export default useMapStore;
