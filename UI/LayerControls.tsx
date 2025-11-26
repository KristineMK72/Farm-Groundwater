"use client";

import { useState } from "react";

type LayerControlsProps = {
  map: any;
};

export default function LayerControls({ map }: LayerControlsProps) {
  const [open, setOpen] = useState(false);

  const toggleLayer = (layerId: string) => {
    const visibility =
      map.getLayoutProperty(layerId, "visibility") === "visible"
        ? "none"
        : "visible";

    map.setLayoutProperty(layerId, "visibility", visibility);
  };

  return (
    <>
      {/* --- TOGGLE BUTTON --- */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          zIndex: 2000,
          background: "#000",
          color: "#fff",
          padding: "12px 18px",
          borderRadius: "8px",
          border: "none",
          fontSize: "16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        {open ? "Close Layers" : "Layers"}
      </button>

      {/* --- SLIDE-UP PANEL --- */}
      <div
        style={{
          position: "absolute",
          bottom: open ? "0" : "-260px",
          left: 0,
          width: "100%",
          height: "260px",
          background: "#fff",
          borderTopLeftRadius: "14px",
          borderTopRightRadius: "14px",
          padding: "18px 22px",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
          zIndex: 1500,
          transition: "bottom 0.35s ease",
          overflowY: "auto",
        }}
      >
        <h3 style={{ marginTop: 0, fontSize: "18px", fontWeight: 600 }}>
          Map Layers
        </h3>

        {/* CHECKBOX LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <label style={{ fontSize: "16px" }}>
            <input type="checkbox" defaultChecked onChange={() => toggleLayer("nitrate-risk-layer")} />{" "}
            Nitrate Risk
          </label>

          <label style={{ fontSize: "16px" }}>
            <input type="checkbox" defaultChecked onChange={() => toggleLayer("water-table-layer")} />{" "}
            Water Table Depth
          </label>

          <label style={{ fontSize: "16px" }}>
            <input type="checkbox" defaultChecked onChange={() => toggleLayer("observation-wells-layer")} />{" "}
            Observation Wells
          </label>

          <label style={{ fontSize: "16px" }}>
            <input type="checkbox" defaultChecked onChange={() => toggleLayer("aquifer-layer")} />{" "}
            Aquifers / Bedrock
          </label>
        </div>
      </div>
    </>
  );
}
