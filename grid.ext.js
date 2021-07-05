class GridExtension extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
    this.grid = null;
  }

  load() {
    // add grid
    this.grid = new THREE.GridHelper(600, 40);
    this.grid.material.opacity = 0.8;
    this.grid.material.transparent = true;
    this.grid.position.set (0, 0, 0);
    if (!this.viewer.overlays.hasScene('grid')) {
        this.viewer.overlays.addScene('grid');
    }
    this.viewer.overlays.addMesh(this.grid, 'grid');
    return true;
  }

  unload() {
    return true;
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension('GridExtension', GridExtension);