import { getPost } from '@/api/post';
import { PostDto } from '@/application/usecases/post/dto/PostDto';
import { useQuery } from '@tanstack/react-query';

export const usePostQuery = (postId: string) => {
  const postQuery = useQuery<PostDto>({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
    enabled: !!postId, // postId가 있을 때만 실행
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    retry: 1 // 실패시 1번만 재시도
  });

  return {
    post: postQuery.data,
    isLoading: postQuery.isLoading,
    error: postQuery.error,
    refetch: postQuery.refetch
  };
};
