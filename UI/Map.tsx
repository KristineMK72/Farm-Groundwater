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
      // Nitrate Risk: Updated to MDH Source Water Protection service (covers SE MN primarily; statewide limited)
      // Note: For full statewide nitrate data, consider MPCA Groundwater Contamination Atlas or downloads from MDH
      map.addSource("nitrate-risk", {
        type: "raster",
        tiles: [
          "https://gisdata.mn.gov/arcgis/rest/services/health/Source_Water_Protection/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
      });
      map.addLayer({
        id: "nitrate-risk-layer",
        type: "raster",
        source: "nitrate-risk",
        paint: { "raster-opacity": 0.55 },
      });

      // Water Table Depth: Updated to DNR statewide service (from Methods for Estimating Water-Table Elevation)
      map.addSource("water-table", {
        type: "raster",
        tiles: [
          "https://arcgis.dnr.state.mn.us/public/rest/services/environment/mndnr_hydrographic_position_index/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
      });
      map.addLayer({
        id: "water-table-layer",
        type: "raster",
        source: "water-table",
        paint: { "raster-opacity": 0.55 },
      });

      // Observation Wells: Updated to DNR County Well Index (CWI/MWI) for monitoring/observation wells
      // Filters to observation/monitoring wells via service; statewide ~500k wells
      map.addSource("observation-wells", {
        type: "vector",
        url: "https://gisdata.mn.gov/arcgis/rest/services/water/Minnesota_Well_Index/MapServer",
      });
      map.addLayer({
        id: "observation-wells-layer",
        type: "circle",
        source: "observation-wells",
        "source-layer": "0", // Adjust layer index if needed (0 = wells)
        paint: {
          "circle-radius": 3,
          "circle-color": "#007cbf",
          "circle-opacity": 0.8,
        },
        filter: ["==", "WellType", "Observation"], // Filter for observation wells; customize based on schema
      });

      // Aquifers/Bedrock: Updated to MGS Bedrock Hydrogeology service
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

      // Additional Water-Related Layers for Enhanced Coverage
      // Groundwater Contamination Areas (MPCA): Areas of concern for nitrate/pollutants
      map.addSource("gw-contamination", {
        type: "vector",
        url: "https://gisdata.mn.gov/arcgis/rest/services/env/MN_GW_Contamination_Atlas/MapServer",
      });
      map.addLayer({
        id: "gw-contamination-layer",
        type: "fill",
        source: "gw-contamination",
        "source-layer": "0", // Areas of concern layer
        paint: {
          "fill-color": "#ff0000",
          "fill-opacity": 0.3,
        },
      });

      // Vulnerable Groundwater Areas (MDA/MDH): Quarter-sections vulnerable to nitrate leaching
      map.addSource("vulnerable-gw", {
        type: "vector",
        url: "https://gisdata.mn.gov/arcgis/rest/services/agri/Vulnerable_Groundwater_Areas/MapServer",
      });
      map.addLayer({
        id: "vulnerable-gw-layer",
        type: "fill",
        source: "vulnerable-gw",
        "source-layer": "0",
        paint: {
          "fill-color": "#ffff00",
          "fill-opacity": 0.4,
        },
      });

      // Groundwater Provinces (DNR): Regional aquifer summaries
      map.addSource("gw-provinces", {
        type: "vector",
        url: "https://gisdata.mn.gov/arcgis/rest/services/geos/Groundwater_Provinces_MN/MapServer",
      });
      map.addLayer({
        id: "gw-provinces-layer",
        type: "fill",
        source: "gw-provinces",
        "source-layer": "0",
        paint: {
          "fill-color": "#00ff00",
          "fill-opacity": 0.2,
        },
      });

      // Springs Inventory (DNR): Point layer for springs (groundwater discharge)
      map.addSource("springs", {
        type: "vector",
        url: "https://arcgis.dnr.state.mn.us/public/rest/services/water/Springs_Inventory/MapServer",
      });
      map.addLayer({
        id: "springs-layer",
        type: "circle",
        source: "springs",
        "source-layer": "0",
        paint: {
          "circle-radius": 4,
          "circle-color": "#4169E1",
          "circle-stroke-width": 1,
          "circle-stroke-color": "#ffffff",
        },
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
