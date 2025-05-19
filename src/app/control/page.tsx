"use client";

import { useState, useEffect } from "react";
import Camera from "@/reusable_component/controlCamera/page";
import axios from "axios";

export default function CarControl() {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [cameraData, setCameraData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCameraData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/data");
        if (response.data && response.data.camera) {
          setCameraData(response.data.camera);
        }
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch camera data");
      } finally {
        setLoading(false);
      }
    };

    fetchCameraData();
    const dataInterval = setInterval(fetchCameraData, 2000);

    return () => {
      clearInterval(dataInterval);
    };
  }, []);

  const handleButtonPress = (direction: string) => {
    console.log(`Button pressed: ${direction}`);
    setActiveButton(direction);
    setTimeout(() => setActiveButton(null), 200);
  };

  const ArrowIcons = {
    Up: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    ),
    Down: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
    ),
    Left: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    ),
    Right: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    ),
    Stop: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="6" width="12" height="12" rx="1" />
      </svg>
    )
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
        <div className="space-y-4 p-4">
          {/* Camera Feed */}
          <div className="relative rounded-lg bg-black p-1 h-64 flex items-center justify-center overflow-hidden">
            {loading ? (
              <div className="flex h-full items-center justify-center text-white">
                Loading camera feed...
              </div>
            ) : error ? (
              <div className="flex h-full items-center justify-center text-red-500">
                {error}
              </div>
            ) : (
              <div className="w-full h-full">
                <Camera camera={cameraData} />
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="grid grid-cols-3 gap-4 items-center justify-items-center">
            {/* Left */}
            <button
              className={`flex h-20 w-20 items-center justify-center rounded-xl border-2 text-xl transition-all duration-200
                ${activeButton === "left" ? "bg-blue-300 shadow-inner" : "bg-black hover:bg-blue-100 border-gray-400 shadow-md"}`}
              onClick={() => handleButtonPress("left")}
            >
              <ArrowIcons.Left />
            </button>

            {/* Up / Stop / Down */}
            <div className="space-y-4">
              <button
                className={`flex h-20 w-20 items-center justify-center rounded-xl border-2 text-xl transition-all duration-200
                  ${activeButton === "forward" ? "bg-blue-300 shadow-inner" : "bg-black hover:bg-blue-100 border-gray-400 shadow-md"}`}
                onClick={() => handleButtonPress("forward")}
              >
                <ArrowIcons.Up />
              </button>
              <button
                className={`flex h-20 w-20 items-center justify-center rounded-xl border-2 text-xl transition-all duration-200
                  ${activeButton === "stop" ? "bg-red-400 shadow-inner" : "bg-red-200 hover:bg-red-300 border-red-500 shadow-md"}`}
                onClick={() => handleButtonPress("stop")}
              >
                <ArrowIcons.Stop />
              </button>
              <button
                className={`flex h-20 w-20 items-center justify-center rounded-xl border-2 text-xl transition-all duration-200
                  ${activeButton === "backward" ? "bg-blue-300 shadow-inner" : "bg-black hover:bg-blue-100 border-gray-400 shadow-md"}`}
                onClick={() => handleButtonPress("backward")}
              >
                <ArrowIcons.Down />
              </button>
            </div>

            {/* Right */}
            <button
              className={`flex h-20 w-20 items-center justify-center rounded-xl border-2 text-xl transition-all duration-200
                ${activeButton === "right" ? "bg-blue-300 shadow-inner" : "bg-black hover:bg-blue-100 border-gray-400 shadow-md"}`}
              onClick={() => handleButtonPress("right")}
            >
              <ArrowIcons.Right />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
