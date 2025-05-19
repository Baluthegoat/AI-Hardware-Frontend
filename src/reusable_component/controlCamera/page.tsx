"use client";

import React, { useState, useEffect } from "react";

interface CameraProps {
  camera?: string;
  className?: string;
}

const Camera: React.FC<CameraProps> = ({ camera = "", className = "" }) => {
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
    <div className="flex justify-center items-center w-full h-full">
      {videoFrame ? (
        <img
          src={videoFrame}
          alt="Live Camera Feed"
          className={`w-full h-full object-cover ${className}`}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-center text-gray-500 p-4">
          No video feed available
        </div>
      )}
    </div>
  );
};

export default Camera;