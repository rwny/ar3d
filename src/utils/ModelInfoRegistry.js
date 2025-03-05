/**
 * Model Information Registry
 * Centralizes metadata for all models
 */

// Import all model metadata files
const metadataContext = import.meta.glob('../component/glb_models/*.json', { eager: true });

// Process metadata
const processedMetadata = {};

Object.entries(metadataContext).forEach(([path, module]) => {
  // Extract model data
  if (module.default && module.default.objects) {
    module.default.objects.forEach(obj => {
      if (obj.id) {
        processedMetadata[obj.id.toLowerCase()] = obj;
      }
    });
  }
});

// API for accessing model data
const ModelInfoRegistry = {
  // Get model info by ID
  getModelInfo(objectId) {
    if (!objectId) return null;
    return processedMetadata[objectId.toLowerCase()] || null;
  },

  // Get all model info
  getAllModelInfo() {
    return Object.values(processedMetadata);
  }
};

export default ModelInfoRegistry;
