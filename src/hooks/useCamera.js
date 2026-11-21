import { useCallback, useRef, useState } from 'react';

export function useCamera() {
  const videoRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState('');

  const startCamera = useCallback(async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (err) {
      setError(`Camera access error: ${err.message}`);
      setIsCapturing(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  }, []);

  return { videoRef, isCapturing, error, setError, startCamera, stopCamera };
}