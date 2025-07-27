import { useRef, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

interface CameraComponentProps {
  capturedImage: string | null;
  onCapture: (imageData: string) => void;
  onRetake: () => void;
}

const CameraComponent = ({
  capturedImage,
  onCapture,
  onRetake,
}: CameraComponentProps) => {
  const {
    state: { user },
  } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setError(null);
    } catch (error) {
      setError("Could not access the camera. Please check permission");
      console.error("Camera error:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (!capturedImage) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [capturedImage]);

  const capturePhoto = async () => {
    if (!videoRef.current || !stream || !photoRef.current) return;
    const video = videoRef.current;
    const canvas = photoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/jpeg");
      try {
        const res = await fetch(imageDataUrl);
        const blob = await res.blob();
        const formData = new FormData();
        formData.append("file", blob, "photo.jpg");
        await api.post(`/files/uploadFile/${user?._id}`, formData);
        onCapture(imageDataUrl);
      } catch (err) {
        console.error("Upload failed", err);
      }
      stopCamera();
    }
  };

  const downloadPhoto = () => {
    if (!capturedImage) return;
    const link = document.createElement("a");
    link.download = "photo.jpg";
    link.href = capturedImage;
    link.click();
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      {!capturedImage ? (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!stream && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              Camera loading...
            </div>
          )}
        </div>
      ) : (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-contain"
          />
        </div>
      )}
      <canvas ref={photoRef} className="hidden" />
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {!capturedImage ? (
          <button
            onClick={capturePhoto}
            disabled={!stream}
            className={`px-4 py-2 rounded transition ${
              stream
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Capture
          </button>
        ) : (
          <>
            <button
              onClick={onRetake}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Retake
            </button>
            <button
              onClick={downloadPhoto}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
            >
              Download
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraComponent;
