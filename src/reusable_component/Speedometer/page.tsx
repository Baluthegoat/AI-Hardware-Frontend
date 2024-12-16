// src/reusable_component/Speedometer/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const Speedometer = () => {
  const [speedData, setSpeedData] = useState({
    speed: 0,
  });

  useEffect(() => {
    // Fetch speedometer data from the backend
    const fetchSpeedometerData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/speedometer");
        setSpeedData(response.data);
      } catch (error) {
        console.error("Error fetching speedometer data:", error);
      }
    };

    fetchSpeedometerData();
  }, []);

  return (
    <div>
      <h2>Speedometer</h2>
      <p>Speed: {speedData.speed} km/h</p>
    </div>
  );
};

export default Speedometer;
