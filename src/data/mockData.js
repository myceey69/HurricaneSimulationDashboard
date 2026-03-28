export const MOCK_ROBOTS = [
  {
    id: "RBT-Alpha",
    type: "Amphibious",
    lat: 29.7604,
    lng: -95.3698,
    heading: 45,
    battery: 82,
    status: "active"
  },
  {
    id: "RBT-Bravo",
    type: "Tracked",
    lat: 29.768,
    lng: -95.378,
    heading: 120,
    battery: 45,
    status: "warning"
  },
  {
    id: "RBT-Charlie",
    type: "Hexapod",
    lat: 29.755,
    lng: -95.360,
    heading: 0,
    battery: 12,
    status: "offline"
  }
];

export const MOCK_HAZARDS = [
  { id: "H-001", type: "debris", lat: 29.7620, lng: -95.3680, severity: "high" },
  { id: "H-002", type: "deep_water", lat: 29.7580, lng: -95.3650, severity: "critical" },
  { id: "H-003", type: "power_lines", lat: 29.7650, lng: -95.3720, severity: "medium" },
  { id: "H-004", type: "collapse", lat: 29.7600, lng: -95.3750, severity: "high" }
];

// Planned path for Alpha (Houston downtown area)
export const PLANNED_PATH = [
  [29.7604, -95.3698],
  [29.7630, -95.3690],
  [29.7650, -95.3675],
  [29.7670, -95.3660],
  [29.7680, -95.3640] // destination
];

export const MOCK_TARGETS = [
  { id: "T-01", type: "stranded_people", lat: 29.7680, lng: -95.3640, count: 3 },
  { id: "T-02", type: "supply_drop", lat: 29.7520, lng: -95.3800, count: 1 }
];

export const FLOOD_ZONES = [
  {
    id: "F-01",
    depth: "shallow",
    polygon: [
      [29.7610, -95.3730],
      [29.7630, -95.3710],
      [29.7590, -95.3660],
      [29.7570, -95.3680]
    ]
  },
  {
    id: "F-02",
    depth: "severe",
    polygon: [
      [29.7550, -95.3650],
      [29.7600, -95.3600],
      [29.7580, -95.3550],
      [29.7530, -95.3620]
    ]
  }
];

// Function to generate simulated telemetry for replay
export const generateTelemetry = (path, stepsPerSegment = 10) => {
  let telemetry = [];
  let currentTime = new Date("2026-03-27T08:00:00Z").getTime();
  
  for (let i = 0; i < path.length - 1; i++) {
    const start = path[i];
    const end = path[i+1];
    const latDiff = end[0] - start[0];
    const lngDiff = end[1] - start[1];
    
    for (let j = 0; j < stepsPerSegment; j++) {
      const fraction = j / stepsPerSegment;
      telemetry.push({
        lat: start[0] + (latDiff * fraction),
        lng: start[1] + (lngDiff * fraction),
        timestamp: currentTime,
        speed: 1.2 + Math.random() * 0.5,
        water_depth: 0.2 + Math.random() * 0.4,
        signal_strength: 85 - Math.random() * 10 - (i * 2)
      });
      currentTime += 5000; // 5 seconds per step
    }
  }
  return telemetry;
};

export const MOCK_TELEMETRY = generateTelemetry(PLANNED_PATH, 20);
