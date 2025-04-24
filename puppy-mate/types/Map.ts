type Location = { lat: number; lng: number; heading?: number | null };
type CourseMarker = kakao.maps.Marker & { courseId?: number };

export type { Location, CourseMarker };
