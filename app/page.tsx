"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// --- RELATIVE IMPORTS (Fixes the Vercel Build Error) ---
// We go "up" one level (..) to find the UI and data folders
import FacilityPanel from "../UI/FacilityPanel"; 
import { facility } from "../data/facility"; 

// --- DYNAMIC MAP IMPORT ---
// Disables Server-Side Rendering (SSR) for the map to prevent crashes
const MapView = dynamic(() => import("../UI/Map"), { 
  ssr: false,
  loading: () => <div style={{ padding: "20px" }}>Loading Map...</div>
});

export default function Home() {
  // Center roughly on Martin County (Southern MN) where the data is
  const startLat = 43.65; 
  const startLon = -94.6; 
  // Recommended zoom: 10 or 11


  const mapMarkers = facility.map((f) => ({
    lat: f.location.lat,     // ✅ Correct: Accessing nested location
    lon: f.location.lon,     // ✅ Correct: Accessing nested location
    // ✅ Correct: Using location.label instead of city
    html: `<div style="text-align:center;"><b>${f.name}</b><br/>${f.location.label}</div>`,
  }));

  return (
    <main style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      
      {/* 1. The Full Screen Map */}
      <MapView 
        lat={startLat} 
        lon={startLon} 
        zoom={6} 
        markers={mapMarkers} 
      />

      {/* 2. The Floating Information Panel */}
      <div 
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000, // Ensures it sits ON TOP of the map
          maxHeight: "90vh",
          overflowY: "auto"
        }}
      >
        <FacilityPanel />
      </div>

    </main>
  );
}
