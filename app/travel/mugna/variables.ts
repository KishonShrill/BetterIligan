export const ILIGAN_CENTER: [number, number] = [124.2511, 8.2459];

export const routesGeoJSON = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: {
        id: "green-entrance",
        color: "#00FF00",
        description: "Entrance from Tambo Traffic Light (One-way)",
      },
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [124.2565276, 8.245204],
          [124.2554573, 8.2458311],
          [124.2528083, 8.2464281],
          [124.2509091, 8.2476723],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        id: "red-exit",
        color: "#ff0000",
        description: "Entrance from Tambo Traffic Light (One-way)",
      },
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [124.2509091, 8.2476723],
          [124.2494484, 8.2447412],
          [124.2488904, 8.24358],
          [124.2485545, 8.2425029],
          [124.2481455, 8.2420195],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        id: "orange-exit",
        color: "#FFA500",
        description: "Franciscan Road (Two-way / Exit)",
      },
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [124.2512232, 8.2431827],
          [124.2509337, 8.2437873],
          [124.2501901, 8.2442677],
          [124.2494512, 8.2447327],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        id: "orange-exit-backwards",
        color: "#FFA500",
        description: "Franciscan Road (Two-way / Exit)",
      },
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [124.2494653, 8.2447501],
          [124.2502142, 8.2442877],
          [124.2509465, 8.2438037],
          [124.2512447, 8.2431899],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        id: "new-frontier-homeowners",
        color: "#15fdfc",
        description: "New Frontier Home Owners",
      },
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [124.2512337, 8.2431856],
          [124.2509282, 8.2437881],
          [124.2501965, 8.2442834],
          [124.2494634, 8.2447428],
          [124.2499089, 8.2455918],
          [124.2484861, 8.2463324],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        id: "new-frontier-homeowners-2",
        color: "#15fdfc",
        description: "New Frontier Home Owners",
      },
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [124.2494634, 8.2447428],
          [124.2489395, 8.2436989],
          [124.2485349, 8.2425022],
          [124.2481446, 8.2420172],
        ],
      },
    },
  ],
};

export const mugnaZoneGeoJSON = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: {
        id: "mugna-polygon",
        name: "MUGNA",
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [124.2509001, 8.2476698],
            [124.2515911, 8.2490567],
            [124.2515826, 8.2492238],
            [124.2515379, 8.2494178],
            [124.2510427, 8.2499512],
            [124.2508233, 8.2501846],
            [124.2500951, 8.2505146],
            [124.2490083, 8.2497303],
            [124.2483334, 8.2490098],
            [124.24843, 8.2488911],
            [124.2502228, 8.248027],
            [124.2509001, 8.2476698],
          ],
        ],
      },
    },
  ],
};

export const interiorDetailsGeoJSON = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: {
        type: "parking",
        name: "Parking",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [124.2512, 8.2489],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        type: "food",
        name: "Parking",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [124.2497, 8.2492],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        type: "attraction",
        name: "Carnival Rides",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [124.2494, 8.2496],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        type: "stage",
        name: "Main Stage",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [124.25, 8.2498],
      },
    },
  ],
};
