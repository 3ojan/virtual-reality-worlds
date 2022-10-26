import {
  Object3D,
  Mesh,
  Vector2,
  Vector3,
  Float32BufferAttribute,
  PlaneGeometry,
  DoubleSide,
  MeshBasicMaterial
} from 'three';

class VRPlaneToSphere extends Object3D {
  constructor(props) {
    super(props);

    this.planeGeom = new PlaneGeometry(
      Math.PI * 382.165605096,
      Math.PI * 191.082802548,
      36,
      18
    );
    this.planeGeom.morphAttributes.position = [];
    var sphereFormation = [];
    var uvs = this.planeGeom.attributes.uv;
    var uv = new Vector2();
    var t = new Vector3();
    this.material = new MeshBasicMaterial({ map: props.texture, side: DoubleSide })

    for (let i = 0; i < uvs.count; i++) {
      uv.fromBufferAttribute(uvs, i);
      //console.log(uv.clone())
      t.setFromSphericalCoords(
        2.5,
        Math.PI * (1 - uv.y),
        Math.PI * (uv.x - 0.5) * 2
      );
      sphereFormation.push(t.x, t.y, t.z);
    }
    this.planeGeom.morphAttributes.position[0] = new Float32BufferAttribute(
      sphereFormation,
      3
    );
    var planeMat = this.material;
    this.spherePlane = new Mesh(this.planeGeom, planeMat);
    this.spherePlane.morphTargetInfluences[0] = 0;

    return this;
  }
  update = (value) => {
    this.spherePlane.morphTargetInfluences[0] = value;
  }
}
export default VRPlaneToSphere 