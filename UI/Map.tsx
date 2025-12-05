// Map.tsx

// ... (imports and MapComponent function body)

useEffect(() => {
  // ... (map initialization code)

  map.on('load', () => {
    // ----------------------------------------------------------------------
    // 1. RASTER SOURCE: NITRATE VULNERABILITY (MDA)
    // - Uses the ArcGIS MapServer 'export' method to pull a single layer image
    // - Layer ID '2' is the Vulnerability layer.
    // ----------------------------------------------------------------------
    map.addSource('nitrate-vulnerability', {
      type: 'raster',
      // CRITICAL: This URL uses the ArcGIS REST service 'export' with the layers parameter.
      tiles: [
        'https://gis.mda.state.mn.us/arcgis/rest/services/MDA_WIMN/MDA_WIMN_WellheadProtection/MapServer/export?bbox={bbox-epsg-3857}&bboxSR=3857&layers=show:2&size=256,256&f=image&transparent=true&format=png32'
      ],
      tileSize: 256,
      minzoom: 5,
      maxzoom: 15,
    });
    
    map.addLayer({
      id: 'nitrate-vulnerability-layer',
      type: 'raster',
      source: 'nitrate-vulnerability',
      paint: { 'raster-opacity': 0.7 },
      layout: { 'visibility': 'none' }
    });

    // ----------------------------------------------------------------------
    // 2. RASTER SOURCE: WATER TABLE DEPTH (DNR Hydrogeology Atlas)
    // - Uses another common DNR MapServer endpoint.
    // - Layer ID '15' is an estimated depth to water table layer.
    // ----------------------------------------------------------------------
    map.addSource('water-table-depth', {
      type: 'raster',
      // CRITICAL: Using the same ArcGIS 'export' format for the DNR Hydrogeology Atlas
      tiles: [
        'https://services.dnr.state.mn.us/arcgis/rest/services/geology/mha/MapServer/export?bbox={bbox-epsg-3857}&bboxSR=3857&layers=show:15&size=256,256&f=image&transparent=true&format=png32'
      ],
      tileSize: 256,
      minzoom: 5,
      maxzoom: 15,
    });
    
    map.addLayer({
      id: 'water-table-depth-layer',
      type: 'raster',
      source: 'water-table-depth',
      paint: { 'raster-opacity': 0.6 },
      layout: { 'visibility': 'none' }
    });


    // ----------------------------------------------------------------------
    // 3. VECTOR SOURCE: ALL WELLS (Minnesota Well Index - MDH)
    // - Uses the standard Mapbox Vector Tile (MVT) format for ArcGIS FeatureServer.
    // - Requires a high zoom level to display.
    // ----------------------------------------------------------------------
    map.addSource('all-wells-vector', {
      type: 'vector',
      // CRITICAL: FeatureServer tiles must end in {z}/{y}/{x}.pbf
      tiles: ['https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Minnesota_Well_Index_View/FeatureServer/0/tile/{z}/{y}/{x}.pbf'],
      minzoom: 10,
      maxzoom: 14
    });

    map.addLayer({
      id: 'all-wells-layer',
      type: 'circle',
      source: 'all-wells-vector',
      'source-layer': 'Minnesota_Well_Index_View', // This MUST match the service name or layer alias
      paint: {
        'circle-color': '#0080ff',
        'circle-radius': 3
      },
      layout: {
        'visibility': 'none'
      }
    });

    // ----------------------------------------------------------------------
    // 4. YOUR FACILITY MARKERS (Unchanged, keep this at the end)
    // ----------------------------------------------------------------------
    // Use an empty GeoJSON source for your facility point data
    map.addSource('facilities', {
      type: 'geojson',
      data: facility as any,
    });

    // Add a circle layer for the facility markers
    map.addLayer({
      id: 'facilities-layer',
      type: 'circle',
      source: 'facilities',
      paint: {
        'circle-color': '#f00', // Red color for your facilities
        'circle-radius': 6,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff',
      },
      layout: {
        'visibility': 'visible', // Always show your facilities
      }
    });
  });

  // ... (map cleanup code)
}, [mapContainer, mapStyle, facility, activeLayers]);
