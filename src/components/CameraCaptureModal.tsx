import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onCapture,
  onClose,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isOpen) {
      // Clean up stream if modal is closed
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      setCapturedImage(null);
      setCountdown(null);
      setError(null);
      return;
    }

    let currentStream: MediaStream | null = null;

    async function startCamera() {
      try {
        setError(null);
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        currentStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error('Camera access error:', err);
        setError('No se pudo acceder a la cámara. Revisa los permisos de tu navegador o sube una foto desde tu galería.');
      }
    }

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const handleTakeSnapshot = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          performCapture();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const performCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mirror image for natural selfie feel
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-5 max-w-lg w-full shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-zinc-800" />
            <h3 className="text-sm font-bold text-zinc-900">
              Captura tu Foto para el Probador
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error ? (
          <div className="py-8 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-xs text-zinc-700 font-medium mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded-lg"
            >
              Cerrar y subir archivo JPG/PNG
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative aspect-3/4 max-h-[380px] mx-auto rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              {capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  {/* Silhouette alignment outline */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center border-2 border-white/20 rounded-xl m-4">
                    <div className="w-24 h-28 border border-dashed border-white/40 rounded-full mb-3"></div>
                    <div className="w-44 h-40 border border-dashed border-white/30 rounded-t-3xl"></div>
                    <span className="absolute bottom-2 text-[10px] text-white/70 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                      Ubícate en el centro de frente
                    </span>
                  </div>
                  {/* Countdown overlay */}
                  {countdown !== null && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                      <span className="text-6xl font-black text-white animate-ping">
                        {countdown}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              {capturedImage ? (
                <>
                  <button
                    onClick={handleRetake}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Repetir
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Usar como Modelo
                  </button>
                </>
              ) : (
                <button
                  onClick={handleTakeSnapshot}
                  disabled={countdown !== null}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  <Camera className="w-4 h-4" />
                  <span>Tomar Foto (3s)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
