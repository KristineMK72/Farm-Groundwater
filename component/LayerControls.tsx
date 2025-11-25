"use client";

import { useState } from "react";
import maplibregl from "maplibre-gl";

type LayerConfig = {
  id: string;
  label: string;
  legend?: { color: string; meaning: string }[];
};

const layers: LayerConfig[] = [
  {
    id: "nitrate-risk-layer",
    label: "Nitrate Risk",
    legend: [
      { color: "#ff0000", meaning: "High risk" },
      { color: "#ffa500", meaning: "Moderate risk" },
      { color: "#ffff00", meaning: "Low risk" },
    ],
  },
  {
    id: "water-table-layer",
    label: "Water Table Depth",
    legend: [
      { color: "#0000ff", meaning: "Shallow (<20 ft)" },
      { color: "#00ffff", meaning: "Moderate (20–50 ft)" },
      { color: "#00ff00", meaning: "Deep (>50 ft)" },
    ],
  },
  {
    id: "observation-wells-layer",
    label: "Observation Wells",
    legend: [{ color: "#0077cc", meaning: "Well location" }],
  },
  {
    id: "aquifer-layer",
    label: "Aquifers / Bedrock",
    legend: [
      { color: "#8b4513", meaning: "Sandstone aquifer" },
      { color: "#708090", meaning: "Shale/bedrock" },
      { color: "#2e8b57", meaning: "Carbonate aquifer" },
    ],
  },
];

export default function LayerControls({ map }: { map: maplibregl.Map }) {
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>(
    Object.fromEntries(layers.map((l) => [l.id, true]))
  );

  const toggleLayer = (id: string) => {
    const isVisible = visibleLayers[id];
    map.setLayoutProperty(id, "visibility", isVisible ? "none" : "visible");
    setVisibleLayers({ ...visibleLayers, [id]: !isVisible });
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        background: "rgba(255,255,255,0.95)",
        padding: "10px",
        borderRadius: "6px",
        fontSize: "14px",
        maxWidth: "220px",
      }}
    >
      <h4 style={{ margin: "0 0 8px 0" }}>Layers</h4>
      {layers.map((layer) => (
        <div key={layer.id} style={{ marginBottom: "8px" }}>
          <label style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={visibleLayers[layer.id]}
              onChange={() => toggleLayer(layer.id)}
              style={{ marginRight: "6px" }}
            />
            {layer.label}
          </label>
          {layer.legend && (
            <div style={{ marginLeft: "16px", marginTop: "4px" }}>
              {layer.legend.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: "14px",
                      height: "14px",
                      background: item.color,
                      marginRight: "6px",
                      border: "1px solid #333",
                    }}
                  />
                  <span>{item.meaning}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
