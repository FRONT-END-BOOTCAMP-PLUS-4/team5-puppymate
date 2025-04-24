'use client';

import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { createUser } from '@/api/user';
import { z } from 'zod';

// Zod 스키마
const signupSchema = z.object({
  email: z.string().email({ message: '유효한 이메일을 입력해주세요.' }),
  password: z
    .string()
    .min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' }),
  nickname: z.string().min(1, { message: '닉네임을 입력해주세요.' }),
});

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSignup = async () => {
    setErrorMessage('');

    // Zod 유효성 검사
    const result = signupSchema.safeParse({ email, password, nickname });

    if (!result.success) {
      const firstError = Object.values(
        result.error.flatten().fieldErrors
      )[0]?.[0];
      setErrorMessage(firstError || '입력값을 확인해주세요.');
      return;
    }

    try {
      const userId = await createUser(
        email,
        password,
        nickname,
        profileImageFile ?? undefined
      );
      console.log('User created with ID:', userId);
      router.push('/login');
    } catch (error) {
      setErrorMessage('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <h2 className='text-2xl font-bold mb-4'>Sign Up</h2>

      <div className='w-80 space-y-4'>
        {errorMessage && (
          <div className='text-sm text-red-500 text-center'>{errorMessage}</div>
        )}

        <Input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type='text'
          placeholder='Nickname'
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        <div className='space-y-1'>
          <input
            id='profileImage'
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setProfileImageFile(e.target.files[0]);
              }
            }}
            className='hidden'
          />
          <Button
            variant='outline'
            type='button'
            onClick={() => fileInputRef.current?.click()}
          >
            {profileImageFile ? profileImageFile.name : '프로필 이미지 선택'}
          </Button>
        </div>

        <Button onClick={handleSignup} className='w-full'>
          Create Account
        </Button>
      </div>
    </div>
  );
}
