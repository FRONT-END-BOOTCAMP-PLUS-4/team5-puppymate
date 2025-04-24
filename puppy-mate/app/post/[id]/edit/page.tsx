'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { usePostQuery } from '@/queries/Post';
import useKakaoLoader from '@/lib/use-kakao-loader';
import { updatePost } from '@/api/post';

export default function EditPostForm() {
  const params = useParams();
  const postId = params && params.id ? params.id as string : '';
  const { post, refetch } = usePostQuery(postId);
  useKakaoLoader();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();
  const images = post && post.images ? post.images : [];

  useEffect(
    () => {
      if (post) {
        setTitle(post.title);
        setContent(post.content || '');
      }
    },
    [post]
  );

  const handleUpdateClick = async () => {
    try {
      await updatePost(postId, title, content);
      await refetch();
      alert('게시글이 수정되었습니다!');
      router.push(`/post/${postId}`);
    } catch (error) {
      alert('수정 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  if (!post)
    return (
      <div>
        {'로딩 중...'}
      </div>
    );

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold">게시글 수정하기</h2>
        <Input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="제목을 입력해주세요!"
        />
      </div>

      {images.length > 0 &&
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, idx) =>
            <div
              key={idx}
              className="relative aspect-square rounded-lg overflow-hidden"
            >
              <Image
                src={url}
                alt={`image-${idx}`}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>}

      <Textarea
        className="w-full min-h-[100px] resize-none"
        placeholder="내용을 입력해주세요"
        value={content}
        onChange={e => setContent(e.target.value)}
      />

      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          ← 취소
        </Button>
        <Button onClick={handleUpdateClick}>저장</Button>
      </div>
    </div>
  );
}
