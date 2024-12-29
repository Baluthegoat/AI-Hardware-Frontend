import React from "react";

interface GPSProps {
  gps: { latitude: number; longitude: number };
}

const GPS: React.FC<GPSProps> = ({ gps }) => {
  return (
    <div className="flex flex-col items-center justify-center text-white">
      <h3>GPS</h3>
      <p>Latitude: {gps.latitude}</p>
      <p>Longitude: {gps.longitude}</p>
    </div>
  );
};

export default GPS;