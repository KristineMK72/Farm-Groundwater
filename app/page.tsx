"use client";

import dynamic from "next/dynamic";
import { facility } from "@/data/facility";
import FacilityPanel from "@/UI/FacilityPanel";

// Dynamic import of Map component with client-side rendering only
const MapView = dynamic(() => import("@/UI/Map"), { ssr: false });

export default function HomePage() {
  const markers = [
    {
      lat: facility.location.lat,
      lon: facility.location.lon,
      html: `<b>${facility.name}</b><br>${facility.location.label}<br/>Primary Well ID: ${facility.wells[0].wellId}`,
    },
  ];

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "1rem" }}>
      <header style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0 }}>Groundwater & Nitrate Context</h1>
        <p style={{ color: "#666", marginTop: "0.5rem" }}>
          Interactive dashboard showing Christensen Farms well data with nitrate risk, water table, and aquifer overlays.
        </p>
      </header>

      <MapView
        lat={facility.location.lat}
        lon={facility.location.lon}
        zoom={facility.location.zoom}
        markers={markers}
      />

      <FacilityPanel />

      <section style={{ marginTop: "2rem" }}>
        <h3 style={{ marginBottom: "0.75rem" }}>Next Layers to Add</h3>
        <ul>
          <li><strong>Water table depth:</strong> statewide tiles overlay</li>
          <li><strong>Nitrate risk:</strong> semi-transparent raster or feature service</li>
          <li><strong>DNR observation wells:</strong> clickable points with recent trends</li>
          <li><strong>Aquifer/bedrock:</strong> polygon outlines and legend</li>
        </ul>
      </section>
    </main>
  );
}
