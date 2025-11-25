import { facility } from "@/data/facility";

export default function FacilityPanel() {
  const w = facility.wells[0];

  return (
    <section style={{ padding: "1rem", borderTop: "1px solid #eee" }}>
      <h2 style={{ margin: 0 }}>{facility.name}</h2>
      <p style={{ marginTop: "0.25rem", color: "#555" }}>{facility.location.label}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div>
          <strong>Well ID:</strong> {w.wellId}<br />
          <strong>Aquifer type:</strong> {w.aquiferType}<br />
          <strong>Aquifer matrix:</strong> {w.aquiferMatrix}<br />
          <strong>Well depth:</strong> {w.wellDepthFtBgs} ft bgs
        </div>
        <div>
          <strong>Static WL:</strong> {w.staticWaterLevelFtBgs} ft bgs ({w.staticWaterLevelDate})<br />
          <strong>Pump depth:</strong> {w.pumpDepthFtBgs} ft bgs<br />
          <strong>Pumping WL:</strong> {w.pumpingWaterLevelFtBgs} ft bgs @ {w.pumpingRateGpm} gpm<br />
          <strong>Water above pump:</strong> ~{w.waterAbovePumpFt} ft
        </div>
      </div>

      <div style={{ marginTop: "0.75rem" }}>
        <strong>Trend:</strong> {w.waterLevelTrend}<br />
        <strong>Recommended:</strong> {w.recommended}
      </div>
    </section>
  );
}
