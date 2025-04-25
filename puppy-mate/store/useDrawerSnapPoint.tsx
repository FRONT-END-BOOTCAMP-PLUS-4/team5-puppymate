import { create } from 'zustand';
import { devtools, combine } from 'zustand/middleware';

// 맵에서 클러스터 혹은 마커 클릭시 : 클릭된 마커의 코스들을 저장하는 스토어
// 경로 상세보기 누르면 경로의 좌표들도 저장한다. 해당 경로는 기록하는 경로(useRecordingMapStore)와 다르다.
const useDrawerSnapPointStore = create(
  devtools(
    combine(
      {
        snapPoints: [0.3, 0.7, 1] as number[],
        snapPoint: 0.3 as number,
      },
      (set, get) => {
        const setSnapPoints = (snapPoints: number[]) => set({ snapPoints });
        const setSnapPoint = (snapPoint: number) => set({ snapPoint });

        return {
          setSnapPoints,
          setSnapPoint,
        };
      }
    )
  )
);

export default useDrawerSnapPointStore;
