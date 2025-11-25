import dynamic from "next/dynamic";
import { facility } from "@/data/facility";
import FacilityPanel from "@/components/FacilityPanel";

const MapView = dynamic(() => import("@/components/Map"), { ssr: false });

export default function HomePage() {
  const markers = [
    {
      lat: facility.location.lat,
      lon: facility.location.lon,
      html: `<b>${facility.name}</b><br>${facility.location.label}<br/>Primary Well ID: ${facility.wells[0].wellId}`,
    },
  ];

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto" }}>
      <header style={{ padding: "1rem 0" }}>
        <h1 style={{ margin: 0 }}>Groundwater & nitrate context</h1>
        <p style={{ color: "#666" }}>
          Accurate tonight. Expand with live nitrate risk, water-table depth, and aquifer layers later.
        </p>
      </header>

      <MapView
        lat={facility.location.lat}
        lon={facility.location.lon}
        zoom={facility.location.zoom}
        markers={markers}
      />

      <FacilityPanel />

      <section style={{ padding: "1rem 0" }}>
        <h3 style={{ marginBottom: "0.5rem" }}>Next layers to add</h3>
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
