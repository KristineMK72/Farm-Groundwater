// change 'facility' to an Array by adding [ and ]
export const facility = [ 
  {
    name: "Christensen Farms",
    location: {
      label: "Dunnell, Martin County, Minnesota",
      lat: 43.612,
      lon: -94.769,
      zoom: 12,
    },
    wells: [
      {
        wellId: "749504",
        aquiferType: "QBAA (Confined)",
        aquiferMatrix: "Fine to Medium Sand",
        wellDepthFtBgs: 308,
        staticWaterLevelFtBgs: 190,
        staticWaterLevelDate: "2007-12-20",
        pumpDepthFtBgs: 360,
        pumpingWaterLevelFtBgs: 200,
        pumpingRateGpm: 30,
        waterAbovePumpFt: 60,
        waterLevelTrend: "Unknown",
        recommended: "Current static water level",
      },
    ],
    notes: [
      "Initial map extent centered near Dunnell—update coordinates as needed.",
      "Data reflects provided facility sheet; more layers will be added live later.",
    ],
  }
]; 
