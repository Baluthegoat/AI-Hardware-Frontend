import React from "react";

interface CameraProps {
  camera: { status: string; feed: string };
}

const Camera: React.FC<CameraProps> = ({ camera }) => {
  return (
    <div className="flex flex-col items-center justify-center text-white">
      <h3>Camera</h3>
      <p>Status: {camera.status}</p>
      {camera.status === "Streaming" && <img src={camera.feed} alt="Live Feed" />}
    </div>
  );
};

export default Camera;
