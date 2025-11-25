"use client";

// FIX: Use relative path (..) instead of "@"
import { facility } from "../data/facility"; 

export default function FacilityPanel() {
  return (
    <div style={{ 
      background: "white", 
      padding: "15px", 
      borderRadius: "8px", 
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      width: "300px",
      fontFamily: "sans-serif"
    }}>
      <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
        Facility List ({facility.length})
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {facility.map((item) => (
          <div key={item.id} style={{ padding: "10px", background: "#f8f9fa", borderRadius: "4px" }}>
            <strong>{item.name}</strong>
            <div style={{ fontSize: "0.9em", color: "#666" }}>{item.city}</div>
            <div style={{ 
              marginTop: "5px", 
              fontSize: "0.8em", 
              fontWeight: "bold",
              color: item.riskLevel === "High" ? "red" : "green" 
            }}>
              Risk: {item.riskLevel}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
