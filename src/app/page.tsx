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
  loading: () => <div className="text-black text-center p-4">Loading map...</div>
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
      <div className="flex justify-center items-center h-screen text-black">
        Loading data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col relative overflow-hidden text-black">
      {/* Top Speedometer Section (Smaller) */}
      <div className="w-full relative flex justify-center mb-3">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[50%] h-14 bg-gray-200 border-b border-l border-r border-black rounded-b-full shadow-md"></div>
        <div className="relative z-15 pt-1 text-bold">
          <Speedometer speed={data.speed} />
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-1 px-4 py-4 justify-between items-center">
        {/* Left Map Panel */}
        <div className="w-1/4 h-96 mx-2">
          <div className="bg-white rounded-lg border border-gray-400 h-full overflow-hidden">
            <div className="text-black text-xs p-2 border-b border-gray-400 bg-gray-100">
              <div>Remain: {data.distance.remain}</div>
              <div>{data.distance.nextTurn}</div>
            </div>
            <div className="h-full w-full">
              <LiveMapBox initialPosition={data.gps} />
            </div>
          </div>
        </div>

        {/* Center Camera Feed */}
        <div className="flex-1 flex justify-center items-center">
          <div className="w-100 h-120 rounded-full border-4 border-gray-400 overflow-hidden flex items-center justify-center">
            <Camera camera={data.camera} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Right Side Panels */}
        <div className="w-1/4 mx-2 flex flex-col gap-4">
          {/* Battery Widget */}
          <div className="bg-white rounded-lg border border-gray-400 p-3">
            <Battery battery={data.battery} />
          </div>

          {/* Temperature Widget */}
          <div className="bg-white rounded-lg border border-gray-400 p-3">
            <Temperature location={data.gps.location} temperature={data.temperature} />
          </div>
        </div>
      </div>

      {/* Bottom Curved Border with Clock */}
      <div className="w-full relative flex justify-center items-center mt-5 mb-2.5 h-15">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[50%] h-20 bg-gray-200 border-t border-l border-r border-black rounded-t-full shadow-lg"></div>
        <div className="relative z-10 text-center text-black">
          <div className="text-sm font-semibold">Time</div>
          <div className="text-2xl font-bold">{time}</div>
        </div>
      </div>
    </div>
  );
}
