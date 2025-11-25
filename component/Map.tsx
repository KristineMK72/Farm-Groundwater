"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { Map } from "maplibre-gl";
import LayerControls from "@/components/LayerControls";

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

    // Add layers once map is loaded
    map.on("load", () => {
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

      // 3. Observation Wells
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
        "source-layer": "0",
        paint: {
          "circle-radius": 5,
          "circle-color": "#0077cc",
          "circle-stroke-color": "#fff",
          "circle-stroke-width": 1,
        },
      });

      // Popups for wells
      map.on("click", "observation-wells-layer", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        const props = feature.properties || {};
        const wellId = props.WELL_ID || "Unknown";
        const aquifer = props.AQUIFER || "N/A";
        const depth = props.WELL_DEPTH || "N/A";
        const trend = props.TREND || "N/A";

        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            `<b>Observation Well</b><br/>
             Well ID: ${wellId}<br/>
             Aquifer: ${aquifer}<br/>
             Depth: ${depth} ft<br/>
             Trend: ${trend}`
          )
          .addTo(map);
      });

      map.on("mouseenter", "observation-wells-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "observation-wells-layer", () => {
        map.getCanvas().style.cursor = "";
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

      setMapReady(true);
    });

    mapRef.current = map;
    return () => map.remove();
  }, [lat, lon, zoom, markers]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={containerRef} style={{ height: "70vh", width: "100%" }} />
      {mapReady && mapRef.current && <LayerControls map={mapRef.current} />}
    </div>
  );
}
