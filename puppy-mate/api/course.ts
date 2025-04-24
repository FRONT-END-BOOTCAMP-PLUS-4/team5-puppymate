import { LatLng } from '@/store/useMapStore';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/courses';

interface CreateCourseResponse {
  id: number;
}

export async function createCourse(
  name: string,
  address: string,
  distance: number,
  duration: number,
  coordinates: LatLng[]
): Promise<number> {
  const response = await axios
    .post<CreateCourseResponse>(BASE_URL, {
      name,
      address,
      distance,
      duration,
      coordinates,
    })
    .catch((error) => {
      console.error('Failed to save course:', error);
      throw error;
    });

  return response.data.id;
}

export async function getPublicCourses() {
  const response = await axios.get(BASE_URL).catch((error) => {
    console.error('Failed to fetch public courses:', error);
    throw error;
  });

  return response.data;
}
export async function getMyCourses() {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No auth token found');

    // /api/courses/my 엔드포인트 호출
    const response = await axios.get(`${BASE_URL}/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // 내 코스 리스트 배열 반환
  } catch (error) {
    console.error('Failed to fetch my courses:', error);
    throw error;
  }
}
