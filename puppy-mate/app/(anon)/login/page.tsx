'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/api/user'; // loginUser 함수 import
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // 로그인 API 호출
      const user = await loginUser(email, password);
      console.log('토큰값과 아이디', user); 
      if (user) {
        // 로그인 성공 시 홈 페이지로 리다이렉트
        router.push('/');
      } else {
        alert('Login failed, please try again.');
      }
    } catch (error) {
      console.error('Failed to login:', error);
      alert('An error occurred during login.');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <h2 className='text-2xl font-bold mb-4'>Login</h2>

      <div className='w-80 space-y-4'>
        <form onSubmit={handleLogin}>
          {/* 이메일 입력 */}
          <Input
            type='email'
            placeholder='Email'
            className='w-full'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* 비밀번호 입력 */}
          <Input
            type='password'
            placeholder='Password'
            className='w-full'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* 로그인 버튼 */}
          <Button type='submit' className='w-full'>
            Login
          </Button>
        </form>

        {/* 회원가입 페이지로 이동하는 버튼 */}
        <div className='text-center'>
          <Link href='/signup' passHref>
            <Button className='w-full' variant='outline'>
              Don't have an account? Sign up here
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
