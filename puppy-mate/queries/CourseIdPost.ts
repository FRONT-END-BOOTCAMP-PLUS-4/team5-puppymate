import { getPostsByCourseId } from '@/api/post';
import { useQueries } from '@tanstack/react-query';

// 코스 아이디로 게시물 조회
export const useCourseIdPostQuery = (courseIds: number[]) => {
  const results = useQueries({
    queries: courseIds.map((id) => ({
      queryKey: ['post', id],
      queryFn: () => getPostsByCourseId(id),
      // default는 0분마다 리패치, 5분마다 데이터 유지
      // staleTime: 5 * 60 * 1000, // 5 minutes
      // cacheTime: 10 * 60 * 1000, // 10 minutes
    })),
  });

  // 모든 쿼리의 상태
  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);
  const errors = results.filter((result) => result.error).map((result) => result.error);
  const isSuccess = results.every((result) => result.isSuccess);

  // 모든 쿼리 데이터를 하나의 배열로 합침
  const posts = isSuccess
    ? results
        .flatMap((result) => result.data || [])
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  // 모든 쿼리 리패치 (필요 없을 듯?)
  // const refetchAll = async () => {
  //   const refetchPromises = results.map((result) => result.refetch());
  //   return Promise.all(refetchPromises);
  // };

  return {
    posts,
    isLoading,
    isError,
    errors,
    isSuccess,
  };
};
