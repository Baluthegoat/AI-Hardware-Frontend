"use client";
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

interface GpsData {
  latitude: number;
  longitude: number;
}

interface MapProps {
  gpsData: GpsData;
}

function Map({ gpsData }: MapProps) {
  const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet');

  useEffect(() => {
    (async () => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: markerIcon.src,
        iconRetinaUrl: markerIcon2x.src,
        shadowUrl: markerShadow.src,
      });
    })();
  }, []);

  const defaultPosition: [number, number] = [0, 0];
  const position: [number, number] = gpsData ? [gpsData.latitude, gpsData.longitude] : defaultPosition;

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {gpsData && (
        <Marker position={position}>
          <Popup>
            <span>
              Latitude: {gpsData.latitude}, Longitude: {gpsData.longitude}
            </span>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

const DynamicMap = dynamic(() => Promise.resolve(Map), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-200">
      <span className="text-gray-600">Loading map...</span>
    </div>
  ),
});

export default DynamicMap;