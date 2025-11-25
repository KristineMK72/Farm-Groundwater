"use client";

import { useEffect, useRef } from "react";
import maplibregl, { Map } from "maplibre-gl";

type Props = {
  lat: number;
  lon: number;
  zoom?: number;
  markers?: { lat: number; lon: number; html: string }[];
};

export default function MapView({ lat, lon, zoom = 12, markers = [] }: Props) {
  const mapRef = useRef<Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current!,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      center: [lon, lat],
      zoom,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    // Facility marker
    markers.forEach((m) => {
      const el = document.createElement("div");
      el.style.background = "#2c3e50";
      el.style.borderRadius = "50%";
      el.style.width = "14px";
      el.style.height = "14px";
      el.style.border = "2px solid #fff";

      const popup = new maplibregl.Popup({ offset: 12 }).setHTML(m.html);

      new maplibregl.Marker({ element: el })
        .setLngLat([m.lon, m.lat])
        .setPopup(popup)
        .addTo(map);
    });

    // --- LAYERS ---

    // 1. Nitrate Risk
    map.addSource("nitrate-risk", {
      type: "raster",
      tiles: [
        "https://gisdata.mn.gov/arcgis/rest/services/health/nitrate_risk/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
    });
    map.addLayer({
      id: "nitrate-risk-layer",
      type: "raster",
      source: "nitrate-risk",
      paint: { "raster-opacity": 0.5 },
    });

    // 2. Water Table Depth
    map.addSource("water-table", {
      type: "raster",
      tiles: [
        "https://mnatlas.org/arcgis/rest/services/Water_Table_Depth/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
    });
    map.addLayer({
      id: "water-table-layer",
      type: "raster",
      source: "water-table",
      paint: { "raster-opacity": 0.5 },
    });

    // 3. Observation Wells (points)
    map.addSource("observation-wells", {
      type: "vector",
      tiles: [
        "https://gisdata.mn.gov/arcgis/rest/services/water/dnr_cgm_wells/MapServer/tile/{z}/{y}/{x}",
      ],
    });
    map.addLayer({
      id: "observation-wells-layer",
      type: "circle",
      source: "observation-wells",
      "source-layer": "0", // layer index
      paint: {
        "circle-radius": 5,
        "circle-color": "#0077cc",
        "circle-stroke-color": "#fff",
        "circle-stroke-width": 1,
      },
    });

    // 4. Aquifer / Bedrock Hydrogeology
    map.addSource("aquifer", {
      type: "raster",
      tiles: [
        "https://gisdata.mn.gov/arcgis/rest/services/geology/bedrock_hydrogeology/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
    });
    map.addLayer({
      id: "aquifer-layer",
      type: "raster",
      source: "aquifer",
      paint: { "raster-opacity": 0.4 },
    });

    // --- Layer toggles ---
    const toggleLayer = (id: string) => {
      const visibility = map.getLayoutProperty(id, "visibility");
      if (visibility === "visible") {
        map.setLayoutProperty(id, "visibility", "none");
      } else {
        map.setLayoutProperty(id, "visibility", "visible");
      }
    };

    // Add simple buttons
    const controls = document.createElement("div");
    controls.style.position = "absolute";
    controls.style.top = "10px";
    controls.style.left = "10px";
    controls.style.background = "rgba(255,255,255,0.9)";
    controls.style.padding = "8px";
    controls.style.borderRadius = "4px";
    controls.style.fontSize = "14px";

    ["nitrate-risk-layer", "water-table-layer", "observation-wells-layer", "aquifer-layer"].forEach(
      (id) => {
        const btn = document.createElement("button");
        btn.innerText = `Toggle ${id}`;
        btn.style.display = "block";
        btn.style.marginBottom = "4px";
        btn.onclick = () => toggleLayer(id);
        controls.appendChild(btn);
      }
    );

    map.getContainer().appendChild(controls);

    mapRef.current = map;
    return () => map.remove();
  }, [lat, lon, zoom, markers]);

  return <div ref={containerRef} style={{ height: "70vh", width: "100%" }} />;
}
