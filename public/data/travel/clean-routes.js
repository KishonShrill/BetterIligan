import fs from "fs";

// 1. Define file paths (update these if your files are named differently)
const CODING_FILE = "jeepneyCoding.json";
const GEOJSON_FILE = "jeepney-routes.json";

// 2. Read and parse both files
let codingData = JSON.parse(fs.readFileSync(CODING_FILE, "utf8"));
let geojsonData = JSON.parse(fs.readFileSync(GEOJSON_FILE, "utf8"));

// 3. Create a lookup map for the coding entries by routeId for fast access
const codingMap = new Map();
codingData.forEach((entry) => {
  // Standardize to uppercase for matching just in case
  codingMap.set(entry.routeId.toUpperCase(), entry);
});

// 4. Process the GeoJSON features
geojsonData.features.forEach((feature) => {
  const props = feature.properties;

  if (!props.routeId) return;

  const routeIdUpper = props.routeId.toUpperCase();

  // Find existing code entry, or create a new one if it doesn't exist
  let codeEntry = codingMap.get(routeIdUpper);
  if (!codeEntry) {
    codeEntry = { routeId: props.routeId };
    codingData.push(codeEntry);
    codingMap.set(routeIdUpper, codeEntry);
  }

  // Transfer 'name' to 'routeName'
  if (props.name) {
    codeEntry.routeName = props.name;
  }

  // Transfer 'stroke' to 'routeColor'
  // (This overrides existing routeColors if they differ, keeping the GeoJSON as the source of truth)
  if (props.stroke) {
    codeEntry.routeColor = props.stroke;
  }

  // 5. Delete the redundant properties from the GeoJSON
  delete props.name;
  delete props.stroke;
});

// 6. Write the cleaned data back to the files
fs.writeFileSync(CODING_FILE, JSON.stringify(codingData, null, 4), "utf8");
fs.writeFileSync(GEOJSON_FILE, JSON.stringify(geojsonData, null, 4), "utf8");

console.log("✅ Successfully transferred properties and cleaned the GeoJSON!");
