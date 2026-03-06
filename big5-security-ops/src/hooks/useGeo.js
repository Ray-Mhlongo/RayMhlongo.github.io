import { useState } from 'react';

export function useGeo() {
  const [coords, setCoords] = useState(null);

  const capture = () => new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        setCoords(value);
        resolve(value);
      },
      reject,
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  return { coords, capture };
}
