class VisibilityController {
  constructor() {
    this.visibleFloors = new Set(['1', '2']);
    this.isolatedObject = null;
    this.previousState = new Map();
  }

  toggleFloor(floor) {
    if (this.visibleFloors.has(floor)) {
      this.visibleFloors.delete(floor);
    } else {
      this.visibleFloors.add(floor);
    }
    return Array.from(this.visibleFloors);
  }

  isVisible(object) {
    if (this.isolatedObject) {
      return object === this.isolatedObject;
    }
    return this.visibleFloors.has(object.userData.floorLevel);
  }

  isolateObject(object, scene) {
    if (!object) return;
    this.previousState.clear();
    scene.traverse((child) => {
      if (child.isMesh) {
        this.previousState.set(child.uuid, child.visible);
        child.visible = child === object;
      }
    });
    this.isolatedObject = object;
  }

  resetIsolation(scene) {
    if (!this.isolatedObject) return;
    scene.traverse((child) => {
      if (child.isMesh) {
        const wasVisible = this.previousState.get(child.uuid);
        child.visible = wasVisible && this.visibleFloors.has(child.userData.floorLevel);
      }
    });
    this.isolatedObject = null;
    this.previousState.clear();
  }
}

export default new VisibilityController();