import React, { useState, useEffect } from "react";

const Camera = ({ camera }) => {
  const [videoFrame, setVideoFrame] = useState("");

  useEffect(() => {
    if (camera) {
      // Update the video frame periodically (simulate continuous video stream)
      const interval = setInterval(() => {
        setVideoFrame("data:image/jpeg;base64," + camera);  // Set the base64 video frame
      }, 100);  // Update every 100ms (adjust based on video frame rate)

      // Cleanup the interval on component unmount
      return () => clearInterval(interval);
    }
  }, [camera]);

  return (
    <div className="relative w-full h-full bg-gray-200 rounded-lg overflow-hidden shadow-lg border border-gray-300">
      {videoFrame ? (
        <img
          src={videoFrame}
          alt="Live Camera Feed"
          className="w-full h-full object-cover"  // Ensures the image covers the container without distortion
        />
      ) : (
        <div className="text-center text-gray-500">No video feed available</div>
      )}
    </div>
  );
};

export default Camera;
