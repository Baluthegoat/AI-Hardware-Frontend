"use client"; // Mark as client component

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Camera() {
  interface CameraData {
    status: string;
    snapshot: string;
  }

  const [cameraData, setCameraData] = useState<CameraData | null>(null);

  useEffect(() => {
    axios
      .get("/api/camera")
      .then((response) => setCameraData(response.data))
      .catch((error) => console.error("Error fetching camera data:", error));
  }, []);

  if (!cameraData) return <div>Loading camera data...</div>;

  return (
    <div className="camera-feed">
      <h2>Camera</h2>
      <p>Status: {cameraData.status}</p>
      <div>
        {cameraData.status === "Live Feed Active" ? (
          <p>Live Feed is active</p>
        ) : (
          <img src={cameraData.snapshot} alt="Camera Snapshot" />
        )}
      </div>
    </div>
  );
}
