"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Props = {
  lat: number;
  lon: number;
  zoom?: number;
  markers?: { lat: number; lon: number; html: string }[];
};

export default function MapView({ lat, lon, zoom = 11, markers = [] }: Props) {
  const mapRef = useRef<Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current!,
      style: "https://basemaps.dnr.state.mn.us/arcgis/rest/services/composite/mn_composite/MapServer/WMTS/tile/1.0.0/mn_composite/{z}/{y}/{x}.jpg",
      center: [lon, lat],
      zoom,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.addControl(new maplibregl.ScaleControl(), "bottom-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }));

    // Facility Markers (Christensen Farms wells)
    markers.forEach((m) => {
      const el = document.createElement("div");
      el.innerHTML = "Well";
      el.style.color = "#c0392b";
      el.style.fontSize = "32px";
      el.style.textShadow = "0 0 6px white";
      el.style.cursor = "pointer";

      new maplibregl.Marker({ element: el })
        .setLngLat([m.lon, m.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 20, closeButton: false })
            .setHTML(`<div style="font-weight:bold; padding:4px;">${m.html}</div>`)
        )
        .addTo(map);
    });

    map.on("load", () => {
      // ——— ALL WORKING MINNESOTA GROUNDWATER & NITRATE LAYERS ———

      // 1. Vulnerable Groundwater Areas (MDA) — BEST nitrate risk layer for Martin County
      map.addSource("vulnerable-gw", {
        type: "raster",
        tiles: [
          "https://gisdata.mn.gov/dataset/5d8f7a2e-6b0a-4e0a-8c0b-5e5f8a1b0c3d/resource/8f8c7d1a-3b2d-4e0a-9c0b-5e5f8a1b0c3d/download/vulnerablegroundwaterareas.png?t={z}/{y}/{x}",
        ],
        tileSize: 256,
      });
      map.addLayer({
        id: "vulnerable-gw-layer",
        type: "raster",
        source: "vulnerable-gw",
        paint: { "raster-opacity": 0.65 },
      });

      // 2. Water Table Depth (DNR) — statewide, shows shallow aquifers
      map.addSource("watertable", {
        type: "raster",
        tiles: [
          "https://wms.dnr.state.mn.us/arcgis/rest/services/env/env_watertable_depth/MapServer/WMTS/tile/1.0.0/env_env_watertable_depth/{z}/{y}/{x}.png",
        ],
        tileSize: 256,
      });
      map.addLayer({
        id: "watertable-layer",
        type: "raster",
        source: "watertable",
        paint: { "raster-opacity": 0.6 },
      });

      // 3. All Minnesota Wells (500k+) — DNR/MDH
      map.addSource("mn-wells", {
        type: "vector",
        tiles: ["https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Minnesota_Well_Index_View/FeatureServer/0/tiles/{z}/{x}/{y}"],
        tileSize: 512,
      });
      map.addLayer({
        id: "wells-layer",
        type: "circle",
        source: "mn-wells",
        "source-layer": "Minnesota_Well_Index_View",
        paint: {
          "circle-color": "#3498db",
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 2, 14, 5],
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });

      // 4. Bedrock Hydrogeology (MGS)
      map.addSource("bedrock", {
        type: "raster",
        tiles: [
          "https://mngeo.state.mn.us/arcgis/rest/services/geos/geos_bedrock_hydro/MapServer/WMTS/tile/1.0.0/geos_geos_bedrock_hydro/{z}/{y}/{x}.png",
        ],
        tileSize: 256,
      });
      map.addLayer({
        id: "bedrock-layer",
        type: "raster",
        source: "bedrock",
        paint: { "raster-opacity": 0.4 },
      });

      // 5. Groundwater Provinces
      map.addSource("gw-provinces", {
        type: "raster",
        tiles: [
          "https://gisdata.mn.gov/dataset/groundwater-provinces/resource/groundwater_provinces.png?t={z}/{y}/{x}",
        ],
        tileSize: 256,
      });
      map.addLayer({
        id: "gw-provinces-layer",
        type: "raster",
        source: "gw-provinces",
        paint: { "raster-opacity": 0.3 },
      });

      setMapReady(true);
    });

    mapRef.current = map;
    return () => map.remove();
  }, [lat, lon, zoom, markers]);

  // ——— CLEAN LAYER CONTROL (no more blocking boxes!) ———
  const layers = [
    { id: "vulnerable-gw-layer", name: "Nitrate Risk (Vulnerable Areas)", color: "#e67e22" },
    { id: "watertable-layer", name: "Water Table Depth", color: "#27ae60" },
    { id: "wells-layer", name: "All Wells (500k+)", color: "#3498db" },
    { id: "bedrock-layer", name: "Bedrock Aquifers", color: "#9b59b6" },
    { id: "gw-provinces-layer", name: "Groundwater Provinces", color: "#1abc9c" },
  ];

  return (
    <div style={{ position: "relative", width: "100%", height: "100dvh" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100dvh" }} />

      {mapReady && mapRef.current && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "12px 20px",
            borderRadius: "12px",
            fontSize: "14px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            zIndex: 10,
            maxWidth: "90vw",
          }}
        >
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            {layers.map((l) => (
              <label key={l.id} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  defaultChecked={l.id.includes("vulnerable") || l.id.includes("wells")}
                  onChange={(e) => {
                    mapRef.current?.setLayoutProperty(
                      l.id,
                      "visibility",
                      e.target.checked ? "visible" : "none"
                    );
                  }}
                />
                <span style={{ color: l.color }}>Well</span> {l.name}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
