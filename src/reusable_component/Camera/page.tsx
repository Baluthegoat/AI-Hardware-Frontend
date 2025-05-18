import React, { useState, useEffect } from "react";

interface CameraProps {
  camera: string;
}

const Camera: React.FC<CameraProps> = ({ camera }) => {
  const [videoFrame, setVideoFrame] = useState("");

  useEffect(() => {
    if (camera) {
      const interval = setInterval(() => {
        setVideoFrame("data:image/jpeg;base64," + camera);
      }, 1);
      return () => clearInterval(interval);
    }
  }, [camera]);

  return (
    <div className="flex justify-center items-center">
      <div
        className="w-65 h-65 rounded-full overflow-hidden border-4"
        style={{
          position: "relative", // Ensures the shadow is properly confined to the circle
        }}
      >
        {videoFrame ? (
          <img
            src={videoFrame}
            alt="Live Camera Feed"
            className="w-full h-full object-cover"
            style={{
              borderRadius: "9999px", // Ensure inner image respects the round shape
              // boxShadow: "0 0 12px 4px rgba(49, 205, 240, 0.9)", // Glow effect applied only to the circular border
            }}
          />
        ) : (
          <div className="text-center text-gray-500 p-4">No video feed available</div>
        )}
      </div>
    </div>
  );
  
};


export default Camera;
