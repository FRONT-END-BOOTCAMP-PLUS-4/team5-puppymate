import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/user';

// 새로운 사용자 생성
export async function createUser(
  email: string,
  password: string,
  nickname: string,
  profileImage?: File
): Promise<number> {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  formData.append('nickname', nickname);
  if (profileImage) {
    formData.append('profileImage', profileImage);
  }

  try {
    const response = await axios.post<{ userId: number }>(
      `${BASE_URL}/signup`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.userId;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
}

// 로그인 처리
export async function loginUser(
  email: string,
  password: string
): Promise<{ userId: number; token: string }> {
  try {
    const response = await axios.post<{ userId: number; token: string }>(
      `${BASE_URL}/login`,
      {
        email,
        password,
      }
    );
    const { userId, token } = response.data;

    // JWT 토큰을 로컬 스토리지에 저장
    localStorage.setItem('authToken', token);

    // userId와 token을 함께 반환
    return { userId, token };
  } catch (error) {
    console.error('Failed to login:', error);
    throw error;
  }
}

export function logoutUser() {
  localStorage.removeItem('authToken');
}

export async function getUserProfile() {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No auth token found');

    const response = await axios.get(`${BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // 유저 정보 객체 반환
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
}
