class TextGeomExtension extends Autodesk.Viewing.Extension {
    constructor(viewer) {
        super(viewer);
        this.viewer = viewer;
        this.layer = "text-layer";
        this.color = 0;
    }

    load() {
        return true;
    }

    unload() {
        return true;
    }

    toggleWireframe() {
        this.mesh.material.wireframe = !this.mesh.material.wireframe;
        this.viewer.impl.invalidate(true, true, true);        
    }

    update( text, size, color ) {
        this.color = color;
        let geom = new THREE.TextGeometry(text, {
            font: "monaco",
            size: size * 5,
            height: 0,
            curveSegments: 3,
        });
        geom.computeBoundingBox();
        
        if (this.mesh) {
            this.mesh.material.color = new THREE.Color(this.color);
            this.mesh.geometry = geom; // if mesh object exists, replace geom with new geometry
        }
        else {
            this.viewer.overlays.addScene(this.layer);
            var mat = new THREE.MeshBasicMaterial({ color: this.color });
            this.mesh = new THREE.Mesh(geom, mat);
            this.viewer.overlays.addMesh(this.mesh, this.layer);            
        }

        //Then, we set its position
        this.mesh.position.x = -20;
        this.mesh.position.y = 0;
        this.mesh.position.z = 1;

        this.viewer.impl.invalidate(true, true, true);
        this.viewer.impl.sceneUpdated(true);
    }

    lookAtMe(){
        this.mesh.quaternion.copy(this.viewer.getCamera().quaternion);
        this.viewer.impl.sceneUpdated(true);
    }

}

Autodesk.Viewing.theExtensionManager.registerExtension('TextGeomExtension', TextGeomExtension);