"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip } from "chart.js";
import { useRouter } from "next/navigation";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

export default function TPdata() {
  const [temperatureData, setTemperatureData] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/data");
        const newTemperature = response.data.temperature || 0;

        setTemperatureData((prev) => [...prev.slice(-49), newTemperature]); // Keep last 50 readings
        setTimestamps((prev) => [
          ...prev.slice(-49),
          new Date().toLocaleTimeString(),
        ]); // Update timestamps
      } catch (error) {
        console.error("Failed to fetch temperature data:", error);
      }
    };

    fetchTemperatureData(); // Fetch once on load
    const interval = setInterval(fetchTemperatureData, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const data = {
    labels: timestamps,
    datasets: [
      {
        label: "Temperature (°C)",
        data: temperatureData,
        fill: true, // This will fill the area beneath the line to make it continuous
        borderColor: "#2E4156", // Using dark color for the line
        tension: 0, // Ensures that the line is straight and continuous between points
        pointBackgroundColor: "#2E4156", // Dark color for points
        pointRadius: 4, // Highlight points slightly
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow the graph to take up more space
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
          font: { size: 16 },
          color: "#2E4156", // Color for X-axis title
        },
        ticks: {
          maxTicksLimit: 10, // Limit the number of X-axis ticks for better spacing
          color: "#AAB7B7", // Color for X-axis ticks
        },
      },
      y: {
        title: {
          display: true,
          text: "Temperature (°C)",
          font: { size: 16 },
          color: "#2E4156", // Color for Y-axis title
        },
        ticks: {
          stepSize: 10, // Adjust the intervals for Y-axis ticks
          color: "#AAB7B7", // Color for Y-axis ticks
        },
        min: -20,
        max: 40,
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            return `Temperature: ${context.raw}°C`;
          },
        },
      },
    },
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#F9FCFF] px-4">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-[#1A2D42] text-white rounded-lg hover:bg-[#2E4156] transition"
          onClick={() => router.back()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-[#2E4156]">
        Detailed Temperature Data
      </h1>
      <div className="w-full lg:w-3/4 bg-white p-6 rounded-lg shadow-lg border border-[#C0C8CA]">
        <div className="h-96"> {/* Adjusted graph height */}
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
}
