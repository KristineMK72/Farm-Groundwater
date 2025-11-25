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

    mapRef.current = map;
    return () => map.remove();
  }, [lat, lon, zoom, markers]);

  return <div ref={containerRef} style={{ height: "70vh", width: "100%" }} />;
}
