// 'use client';

// import { useEffect, useRef, useState } from 'react';

// interface LatLng {
//   lat: number;
//   lng: number;
// }

// export const useRouteTracker = () => {
//   const [route, setRoute] = useState<LatLng[]>([]);
//   const [heading, setHeading] = useState<number | null>(null);
//   const watchIdRef = useRef<number | null>(null);
//   const lastSavedRef = useRef<LatLng | null>(null);

//   useEffect(() => {
//     // 👉 방향 추적 (자이로센서)
//     const handleOrientation = (e: DeviceOrientationEvent) => {
//       if (typeof e.alpha === 'number') {
//         setHeading(e.alpha);
//       }
//     };

//     // iOS 대응
//     if (
//       typeof DeviceOrientationEvent !== 'undefined' &&
//       typeof DeviceOrientationEvent.requestPermission === 'function'
//     ) {
//       DeviceOrientationEvent.requestPermission()
//         .then((res) => {
//           if (res === 'granted') {
//             window.addEventListener('deviceorientation', handleOrientation);
//           }
//         })
//         .catch(console.error);
//     } else {
//       window.addEventListener('deviceorientation', handleOrientation);
//     }

//     // 👉 실시간 위치 추적
//     watchIdRef.current = navigator.geolocation.watchPosition(
//       (pos) => {
//         const newPoint = {
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//         };

//         const last = lastSavedRef.current;
//         if (!last || getDistance(last, newPoint) > 10) {
//           setRoute((prev) => [...prev, newPoint]);
//           lastSavedRef.current = newPoint;
//         }
//       },
//       (err) => console.error('위치 추적 에러:', err),
//       {
//         enableHighAccuracy: true,
//         timeout: 5000,
//         maximumAge: 0,
//       }
//     );

//     return () => {
//       if (watchIdRef.current !== null) {
//         navigator.geolocation.clearWatch(watchIdRef.current);
//       }
//       window.removeEventListener('deviceorientation', handleOrientation);
//     };
//   }, []);

//   return { route, heading };
// };

// // 📏 두 지점 간 거리 계산 (단위: m)
// function getDistance(p1: LatLng, p2: LatLng) {
//   const R = 6371000;
//   const toRad = (v: number) => (v * Math.PI) / 180;
//   const dLat = toRad(p2.lat - p1.lat);
//   const dLng = toRad(p2.lng - p1.lng);
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(toRad(p1.lat)) *
//       Math.cos(toRad(p2.lat)) *
//       Math.sin(dLng / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }
