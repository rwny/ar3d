class SceneManager {
  constructor() {
    this.currentScene = 'overview'; // 'overview' or 'detail'
    this.selectedBuilding = null;
    this.selectedBuildingInfo = null;
    this.observers = new Set();
  }

  subscribe(callback) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  notify() {
    this.observers.forEach(callback => callback({
      scene: this.currentScene,
      building: this.selectedBuilding
    }));
  }

  selectBuilding(buildingId) {
    this.selectedBuilding = buildingId;
    this.currentScene = 'detail';
    this.notify();
  }

  returnToOverview() {
    this.selectedBuilding = null;
    this.selectedBuildingInfo = null;
    this.currentScene = 'overview';
    this.notify();
  }
}

export default new SceneManager();
