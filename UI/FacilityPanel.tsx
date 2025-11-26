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
        
        {/* UPDATED MAPPING LOGIC */}
        {facility.map((item, index) => (
          <div key={index} style={{ padding: "10px", background: "#f8f9fa", borderRadius: "4px" }}>
            
            <strong>{item.name}</strong>
            
            {/* UPDATED: Uses location.label instead of city */}
            <div style={{ fontSize: "0.9em", color: "#666" }}>
              {item.location.label}
            </div>

            {/* UPDATED: Removed riskLevel (doesn't exist) and added Well count */}
            <div style={{ marginTop: "5px", fontSize: "0.8em" }}>
              <strong>Wells:</strong> {item.wells.length}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
