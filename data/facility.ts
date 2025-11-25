export const facility = [
  // 1. Your Original Site (Dunnell)
  {
    name: "Christensen Farms (Dunnell)",
    location: {
      label: "Dunnell, Martin County, MN",
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
      "Primary facility.",
      "Initial map extent centered near Dunnell.",
    ],
  },

  // 2. New Site: Sherburn (West of Dunnell)
  {
    name: "Sherburn West Operations",
    location: {
      label: "Sherburn, Martin County, MN",
      lat: 43.651,
      lon: -94.726,
      zoom: 12,
    },
    wells: [
      {
        wellId: "558291",
        aquiferType: "QWTA (Water Table)",
        aquiferMatrix: "Coarse Gravel",
        wellDepthFtBgs: 120,
        staticWaterLevelFtBgs: 45,
        staticWaterLevelDate: "2015-06-15",
        pumpDepthFtBgs: 100,
        pumpingWaterLevelFtBgs: 65,
        pumpingRateGpm: 55,
        waterAbovePumpFt: 35,
        waterLevelTrend: "Stable",
        recommended: "Monitor seasonally",
      },
    ],
    notes: [
      "Shallower well interacting with surface water table.",
      "Requires quarterly nitrate testing.",
    ],
  },

  // 3. New Site: Fairmont (East, with MULTIPLE wells)
  {
    name: "Fairmont Processing Hub",
    location: {
      label: "Fairmont, Martin County, MN",
      lat: 43.652,
      lon: -94.461,
      zoom: 11,
    },
    wells: [
      {
        wellId: "882101-A",
        aquiferType: "Jordan Sandstone",
        aquiferMatrix: "Sandstone",
        wellDepthFtBgs: 450,
        staticWaterLevelFtBgs: 210,
        staticWaterLevelDate: "2020-01-10",
        pumpDepthFtBgs: 400,
        pumpingWaterLevelFtBgs: 240,
        pumpingRateGpm: 120,
        waterAbovePumpFt: 160,
        waterLevelTrend: "Declining",
        recommended: "Reduce pumping rate",
      },
      {
        wellId: "882101-B",
        aquiferType: "QBAA (Confined)",
        aquiferMatrix: "Sand/Clay",
        wellDepthFtBgs: 280,
        staticWaterLevelFtBgs: 150,
        staticWaterLevelDate: "2021-03-22",
        pumpDepthFtBgs: 250,
        pumpingWaterLevelFtBgs: 180,
        pumpingRateGpm: 40,
        waterAbovePumpFt: 70,
        waterLevelTrend: "Stable",
        recommended: "Backup supply only",
      },
    ],
    notes: [
      "High capacity facility.",
      "Well B is strictly for backup use during peak summer months.",
    ],
  },
];
