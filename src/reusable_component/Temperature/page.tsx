// src/reusable_component/Temperature/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const Temperature = () => {
  const [temperatureData, setTemperatureData] = useState({
    internal: "",
    external: "",
  });

  useEffect(() => {
    // Fetch temperature data from the backend
    const fetchTemperatureData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/temperature");
        setTemperatureData(response.data);
      } catch (error) {
        console.error("Error fetching temperature data:", error);
      }
    };

    fetchTemperatureData();
  }, []);

  return (
    <div>
      <h2>Temperature</h2>
      <p>Internal: {temperatureData.internal}</p>
      <p>External: {temperatureData.external}</p>
    </div>
  );
};

export default Temperature;