"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { Map } from "maplibre-gl";
import LayerControls from "./LayerControls";

import "maplibre-gl/dist/maplibre-gl.css";

type Props = {
  lat: number;
  lon: number;
  zoom?: number;
  markers?: { lat: number; lon: number; html: string }[];
};

export default function MapView({ lat, lon, zoom = 12, markers = [] }: Props) {
  const mapRef = useRef<Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mapReady, setMapReady] = useState(false);

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

    // ---- FACILITY MARKERS ----
    markers.forEach((m) => {
      const el = document.createElement("div");
      el.style.background = "#2c3e50";
      el.style.borderRadius = "50%";
      el.style.width = "14px";
      el.style.height = "14px";
      el.style.border = "2px solid white";

      const popup = new maplibregl.Popup({ offset: 12 }).setHTML(m.html);

      new maplibregl.Marker({ element: el })
        .setLngLat([m.lon, m.lat])
        .setPopup(popup)
        .addTo(map);
    });

    // ---- RASTER LAYERS ----
    map.on("load", () => {
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
        paint: { "raster-opacity": 0.55 },
      });

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
        paint: { "raster-opacity": 0.55 },
      });

      map.addSource("observation-wells", {
        type: "raster",
        tiles: [
          "https://gisdata.mn.gov/arcgis/rest/services/water/dnr_cgm_wells/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
      });
      map.addLayer({
        id: "observation-wells-layer",
        type: "raster",
        source: "observation-wells",
        paint: { "raster-opacity": 1 },
      });

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
        paint: { "raster-opacity": 0.45 },
      });

      setMapReady(true);
    });

    mapRef.current = map;
    return () => map.remove();
  }, [lat, lon, zoom, markers]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Fullscreen Map */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
        }}
      />

      {/* Slide-Up Drawer for Layers */}
      {mapReady && mapRef.current && (
        <LayerControls map={mapRef.current} />
      )}
    </div>
  );
}
