/**
 * ModelLoader.js - Simplified model and metadata management
 * Handles loading 3D models and their associated metadata
 */
import modelMetadata from '../component/glb_models/model_1.json';

// Auto-import all GLB files from the glb_models directory
const modelFiles = import.meta.glob('../component/glb_models/*.glb', { eager: true });

// Model registry
const models = {};
// Create a lookup for metadata by ID (for faster lookups)
const metadataById = {};

// Process the metadata first
modelMetadata.objects.forEach(obj => {
  if (obj.id) {
    metadataById[obj.id.toLowerCase()] = obj;
  }
});

// Process all GLB files
Object.entries(modelFiles).forEach(([path, module]) => {
  // Extract model ID from path (e.g., '../component/glb_models/ar12.glb' -> 'ar12')
  const modelId = path.split('/').pop().replace('.glb', '').toLowerCase();
  models[modelId] = {
    id: modelId,
    path: path,
    url: module.default, // The resolved URL from Vite
    // Find metadata for this model if it exists
    metadata: metadataById[modelId] || null
  };
});

// Debug output to help verify the matching
console.log('Models loaded:', Object.keys(models));
console.log('Metadata loaded:', Object.keys(metadataById));

// Simplified API
const ModelLoader = {
  // Get model URL by ID
  getModelUrl(modelId) {
    if (!modelId) return null;
    const model = models[modelId.toLowerCase()];
    return model ? model.url : null;
  },

  // Get model metadata by ID or name
  getModelData(identifier) {
    if (!identifier) return null;
    
    // First try direct ID lookup
    const normalizedId = identifier.toLowerCase();
    
    // Try to find by ID in models
    if (models[normalizedId] && models[normalizedId].metadata) {
      return models[normalizedId].metadata;
    }
    
    // If not found, try to find in metadata directly
    if (metadataById[normalizedId]) {
      return metadataById[normalizedId];
    }
    
    // If still not found, try to match by name (slower)
    const byName = Object.values(metadataById).find(
      item => item.name && item.name.toLowerCase() === normalizedId
    );
    
    return byName || null;
  },

  // Get both model URL and metadata
  getModel(modelId) {
    if (!modelId) return null;
    const model = models[modelId.toLowerCase()];
    return model || null;
  },

  // Get overview model URL
  getOverviewModelUrl() {
    return this.getModelUrl('ar00');
  },
  
  // Get all available model IDs
  getAllModelIds() {
    return Object.keys(models);
  },

  // Get all building models (excluding overview model)
  getBuildingModels() {
    return Object.values(models).filter(model => model.id !== 'ar00');
  },

  // Get building info format compatible with existing code
  getBuildingInfo(buildingId) {
    if (!buildingId) return null;
    const model = models[buildingId.toLowerCase()];
    if (!model || model.id === 'ar00') return null;
    
    return {
      id: model.id,
      modelUrl: model.url,
      metadata: model.metadata
    };
  },

  // Link a model object to its metadata
  linkModelToMetadata(modelObject) {
    if (!modelObject || !modelObject.name) return null;
    
    // Get the metadata for this model
    const metadata = this.getModelData(modelObject.name);
    
    // Attach the metadata to the model object if found
    if (metadata) {
      modelObject.userData = {
        ...modelObject.userData,
        metadata
      };
    }
    
    return metadata;
  }
};

export default ModelLoader;
