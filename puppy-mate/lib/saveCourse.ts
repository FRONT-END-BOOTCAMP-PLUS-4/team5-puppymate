'use client';
import useMapStore from '@/store/useMapStore';
import { getDistance } from '@/utils/map/getDistance';
import { getCoordinateAddress } from '@/utils/map/getCoordinateAddress';
import { createCourse } from '@/api/course';
import { toast } from 'sonner';
export const saveCourse = async (name: string) => {
  const { coordinates, startTime } = useMapStore.getState();

  const duration = new Date().getTime() - startTime;
  let totalDistance = 0;
  let address = '';
  // 도로 좌표 {lat: 37.56423690189401, lng: 127.00764941529607}
  coordinates.forEach((coord, index) => {
    if (index > 0) {
      totalDistance += getDistance(coordinates[index - 1], coord);
    }
  });

  if (name.length === 0) {
    toast.error('코스 이름을 입력해주세요.');
    return;
  }

  if (totalDistance < 5) {
    toast.error('최소 5m 이상 걸어야 저장할 수 있습니다.');
    return;
  }

  try {
    address = await getCoordinateAddress(coordinates[0].lng, coordinates[0].lat);
  } catch (error) {
    console.error('Error fetching address:', error);
  }
  try {
    // createCourse 호출
    const courseId = await createCourse(
      name,
      address,
      totalDistance,
      duration,
      coordinates.map((coord) => ({ lat: coord.lat, lng: coord.lng }))
    );
    toast.success('코스 저장에 성공했습니다.');
    return courseId;
  } catch (error) {
    toast.error('코스 저장에 실패했습니다: ' + error);
    console.error('Failed to save course:', error);
    return null;
  }
};
