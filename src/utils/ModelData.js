import ModelInfoRegistry from './ModelInfoRegistry';

const ModelData = {
  getDataForObject: (objectName) => {
    return ModelInfoRegistry.getModelInfo(objectName);
  }
};

export default ModelData;
