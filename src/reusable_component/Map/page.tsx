"use client";

import { useState, useEffect } from 'react';
import Map from 'react-map-gl';
import { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Fix for window undefined in SSR
const Mapbox = typeof window !== 'undefined' ? Map : () => null;

export default function LiveMapBox() {
  const [position, setPosition] = useState({
    latitude: 26.850474,  // Default starting position (matches your dummy server)
    longitude: 89.39382,
  });
  const [popupInfo, setPopupInfo] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/data');
        const data = await response.json();
        
        if (data.gps?.latitude && data.gps?.longitude) {
          setPosition({
            latitude: data.gps.latitude,
            longitude: data.gps.longitude
          });
        }
      } catch (error) {
        console.error('Error fetching GPS data:', error);
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval for live updates (every second)
    const interval = setInterval(fetchData, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full">
      <Mapbox
        initialViewState={{
          longitude: position.longitude,
          latitude: position.latitude,
          zoom: 15,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        <Marker
          longitude={position.longitude}
          latitude={position.latitude}
          anchor="bottom"
        >
          <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-5 h-5"
            >
              <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
            </svg>
          </div>
        </Marker>
        
        {popupInfo && (
          <Popup
            longitude={position.longitude}
            latitude={position.latitude}
            anchor="top"
            closeButton={false}
            onClose={() => setPopupInfo(false)}
          >
            <div className="text-center text-black">
              <h3 className="font-bold">Car Location</h3>
              <p>Lat: {position.latitude.toFixed(6)}</p>
              <p>Lng: {position.longitude.toFixed(6)}</p>
              <p className="text-xs mt-1">Click map to close</p>
            </div>
          </Popup>
        )}
      </Mapbox>
    </div>
  );
}

