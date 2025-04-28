import { LatLng } from '@/types/Map';
import axios from 'axios';

// 환경변수가 있으면 사용, 없으면 빈 문자열로 설정
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

interface CreateCourseResponse {
  id: number;
  newCourse?: {
    courseId: number;
  };
}

export async function createCourse(
  name: string,
  address: string,
  distance: number,
  duration: number,
  coordinates: LatLng[]
): Promise<number | undefined> {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('No auth token found');
  const response = await axios
    .post<CreateCourseResponse>(
      `${BASE_URL}/api/courses`,
      {
        name,
        address,
        distance,
        duration,
        coordinates,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .catch((error) => {
      console.error('Failed to save course:', error);
      throw error;
    });
  console.log('Course creation response:', response.data); // 응답 데이터 로깅
  // 서버 응답 구조에 맞게 수정
  return response.data.newCourse?.courseId;
}

export async function getPublicCourses() {
  const response = await axios.get(`${BASE_URL}/api/courses`).catch((error) => {
    console.error('Failed to fetch public courses:', error);
    throw error;
  });

  return response.data;
}
