import axios from 'axios';
const BASE_URL = 'http://localhost:3000/api/coordinates';

export async function getCourseCoordinates(courseId: string) {
  try {
    const response = await axios.get(`${BASE_URL}/${courseId}`);
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch coordinates:', error);
    throw error;
  }
}
