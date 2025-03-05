/**
 * Dynamic Model Registry
 * This file manages all 3D model assets in a centralized location.
 * New models can be added with minimal code changes.
 */

// Import model module context using Vite's import.meta.glob
// This loads all GLB files in the glb_models directory
const modelModules = import.meta.glob('./glb_models/*.glb', { eager: true });

// Extract the models from the modules
export const MODEL_FILES = {};
Object.entries(modelModules).forEach(([path, module]) => {
  // Extract the model ID from the path (e.g., './glb_models/ar12.glb' -> 'ar12')
  const modelId = path.split('/').pop().replace('.glb', '');
  MODEL_FILES[modelId] = module.default;
});

// Automatically generate building mappings from model files
export const BUILDING_MAPPINGS = {};
Object.keys(MODEL_FILES).forEach(id => {
  // Skip the overview model 'ar00'
  if (id !== 'ar00') {
    BUILDING_MAPPINGS[id] = {
      id: id,
      modelUrl: MODEL_FILES[id],
      // Additional metadata could be loaded from a JSON file
    };
  }
});

// Get overview model
export const getOverviewModel = () => MODEL_FILES.ar00;

// Get building model by ID
export const getBuildingModel = (buildingId) => {
  if (!buildingId) return null;
  const normalizedId = buildingId.toLowerCase();
  return MODEL_FILES[normalizedId] || null;
};

// Get building info by ID
export const getBuildingInfo = (buildingId) => {
  if (!buildingId) return null;
  const normalizedId = buildingId.toLowerCase();
  return BUILDING_MAPPINGS[normalizedId] || null;
};

// List all available buildings
export const getAllBuildingIds = () => 
  Object.keys(BUILDING_MAPPINGS);

// Get all available building info
export const getAllBuildingInfo = () => 
  Object.values(BUILDING_MAPPINGS);
