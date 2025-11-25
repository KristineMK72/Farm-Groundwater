"use client";

import { facility } from "@/data/facility";

export default function FacilityPanel() {
  return (
    <section style={{ padding: "1rem 0" }}>
      <h2>{facility.name}</h2>
      <p>{facility.location.label}</p>
      <h3>Wells</h3>
      <ul>
        {facility.wells.map((well) => (
          <li key={well.wellId}>
            <strong>{well.wellId}</strong> – Depth: {well.depth} ft – Status: {well.status}
          </li>
        ))}
      </ul>
    </section>
  );
}
