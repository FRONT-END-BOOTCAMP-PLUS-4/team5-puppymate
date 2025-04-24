'use client';
import { usePostQuery } from '@/queries/Post';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import SnapShotMap from '@/app/components/map/SnapShotMap';
import useKakaoLoader from '@/lib/use-kakao-loader';
import { formatDate } from '@/utils/common';
import { deletePost } from '@/api/post';

export default function PostDetailPage() {
  const params = useParams();
  const postId = params?.id as string;
  const { post, isLoading, error } = usePostQuery(postId);
  useKakaoLoader();
  const router = useRouter();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading post</div>;
  if (!post) return <div>Post not found</div>;
  const handleDeleteBtnClick = async () => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;
    try {
      const result = await deletePost(postId);
      if (result.isSuccess) {
        alert(result.message); // 예: "삭제되었습니다."
        router.push("/"); // 홈이나 목록 페이지 등으로 이동
      }
    } catch (err) {
      alert("삭제에 실패했습니다.");
    }
  };
  const handleEditClick = () => {
    if (postId) {
      router.push(`/post/${postId}/edit`); // 수정 페이지로 이동
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <div className="flex justify-between text-gray-500 text-sm">
          <span>작성일: {post.createdAt ? formatDate(post.createdAt) : ''}</span>
        </div>
      </div>

      {/* Map */}
      {post.coordinates && (
        <div className="rounded-lg overflow-hidden">
          <SnapShotMap coordinates={post.coordinates} size={400} />
        </div>
      )}

      {/* Image Carousel */}
      {post.images && post.images.length > 0 && (
        <Carousel className="w-full">
          <CarouselContent>
            {post.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`Post image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}

      {/* Content */}
      <div className="prose max-w-none">
        <p className="whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={() => window.history.back()}>
          ← 목록으로
        </Button>
        {post.isWriter && (
        <div className="space-x-2">
          <Button onClick={handleEditClick}variant="outline">수정</Button>
          <Button onClick={handleDeleteBtnClick} variant="destructive">삭제</Button>
        </div>
        )}
      </div>
    </div>
  );
}
