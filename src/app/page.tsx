"use client";

import React, { useEffect, useState } from "react";
import Camera from "../reusable_component/Camera/page";
import Speedometer from "../reusable_component/Speedometer/page";
import Battery from "../reusable_component/Battery/page";
import Temperature from "../reusable_component/Temperature/page";
import axios from "axios";
import dynamic from 'next/dynamic';

type InitialPosition = {
  latitude: number;
  longitude: number;
  location: string;
};

interface LiveMapBoxProps {
  initialPosition: InitialPosition;
}

const LiveMapBox = dynamic(() => import('../reusable_component/Map/page'), {
  ssr: false,
  loading: () => <div className="text-white text-center p-4">Loading map...</div>
});

export default function Dashboard() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [data, setData] = useState({
    speed: "65",
    gps: { latitude: 0, longitude: 0, location: "Bronx, NY" },
    battery: { percentage: 100, health: "Good", remainingTime: "34 hr 2 min" },
    camera: "",
    distance: { remain: "32.15 mi", nextTurn: "↰ 2.3 mi Left" },
    temperature: "17°C"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/data");
        const newData = {
          speed: response.data.speed || "65",
          gps: response.data.gps || { latitude: 0, longitude: 0, location: "Bronx, NY" },
          battery: response.data.battery || { percentage: 100, health: "Good", remainingTime: "34 hr 2 min" },
          camera: response.data.camera || "",
          distance: response.data.distance || { remain: "32.15 mi", nextTurn: "↰ 2.3 mi Left" },
          temperature: response.data.temperature || "17°C"
        };

        setData(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(newData)) {
            return newData;
          }
          return prev;
        });

        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const dataInterval = setInterval(fetchData, 2000);
    const timeInterval = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(timeInterval);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-800">
        Loading data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen flex flex-col relative overflow-hidden">
      {/* Top Speedometer Section with Curved Border */}
      <div className="w-full relative flex justify-center mb-5">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4/5 h-20 bg-gray-900 border-b border-l border-r border-gray-700 rounded-b-full shadow-lg"></div>
        <div className="relative z-10 pt-2.5">
          <Speedometer speed={data.speed} />
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-1 px-4 py-4 justify-between items-center">
        {/* Left Map Panel */}
        <div className="w-1/4 h-64 mx-2">
          <div className="bg-black rounded-lg border border-cyan-400 h-full overflow-hidden">
            <div className="text-white text-xs p-2 border-b border-cyan-400 bg-gray-900 bg-opacity-70">
              <div>Remain: {data.distance.remain}</div>
              <div>{data.distance.nextTurn}</div>
            </div>
            <div className="h-[83%] w-full">
              <LiveMapBox initialPosition={data.gps} />
            </div>
          </div>
        </div>

        {/* Center Camera Feed */}
        <div className="flex-1 flex justify-center items-center">
          <div className="w-80 h-80 rounded-full border-4 border-cyan-400 overflow-hidden flex items-center justify-center">
            <Camera camera={data.camera} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Right Side Panels */}
        <div className="w-1/4 mx-2 flex flex-col gap-4">
          {/* Battery Widget */}
          <div className="bg-black rounded-lg border border-cyan-400 p-3">
            <Battery battery={data.battery} />
          </div>

          {/* Temperature Widget */}
          <div className="bg-black rounded-lg border border-cyan-400 p-3">
            <Temperature location={data.gps.location} temperature={data.temperature} />
          </div>
        </div>
      </div>

      {/* Bottom Curved Border with Clock */}
      <div className="w-full relative flex justify-center items-center mt-5 mb-2.5 h-20">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-20 bg-gray-900 border-t border-l border-r border-gray-700 rounded-t-full shadow-lg"></div>
        <div className="relative z-10 text-center text-white">
          <div className="text-sm font-semibold">Time</div>
          <div className="text-2xl font-bold">{time}</div>
        </div>
      </div>
    </div>
  );
}