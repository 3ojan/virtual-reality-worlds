import {
  Object3D,
  Vector3,
  Mesh,
  MeshBasicMaterial,
  DoubleSide,
  Quaternion,
  PlaneGeometry
} from 'three';
import {
  rotateAboutPoint,
  degrees_to_radians,
  radians_to_degrees
} from './helpers/worldHelpers';
import {
  textureLoader,
  textureToggleGeometry,
  delete_icon,
  settings_icon,
  menuPositionCircleGeometry,
  emptyTexture,
} from './helpers/texturesAndGeometries';

// import gsap from 'gsap/all';

class VRObject3D extends Object3D {

  unique_id = null;
  clicked = false;
  mouseOver = false;
  mouseDown = false;
  material;
  containerName = null;
  pNormal = new Vector3(0, 1, 0);
  vec3 = new Vector3();
  limits = {
    min: 100,
    max: 500,
    distance: 300
  }

  constructor(containerName) {
    super();
    this.dbConfig = {
      rotateX: 0,
      rotateY: 0
    }
    this.containerName = containerName;
    this.withStaticRotations = false;
    this.customIcon = false;
    return this;
  }

  /***
   * @private
   */
  _setInitialPosRot() {
    const position = new Vector3();
    const quaternion = new Quaternion();
    const scale = new Vector3();

    this.camera.matrixWorld.decompose(position, quaternion, scale);
    this.quaternion.copy(quaternion);
    this.position.copy(position);
    this.mesh.translateZ(-300);
    this.mesh.containerName = this.containerName;
  }
  /**
   * @public
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} z 
   */
  setPosition(x, y, z) {
    this.mesh.position.copy(new Vector3(x, y, z));
  };

  setId(id) {
    this.unique_id = id;
  };

  getId() {
    return this.unique_id;
  };

  updatePosition(point, axis, theta, camera) {
    rotateAboutPoint(this, point, axis, theta, null, camera);
  };
  /**
   * @public
   * @param { MeshBasicMaterial{map:texture} } newMaterial 
   */
  updateMaterial(newMaterial) {
    this.mesh.material = newMaterial;
  };
  // onSelect() {
  //     this.material.opacity = .7;
  //     console.log('onSelect obj');
  // };
  // onDeselect() {
  //     this.material.opacity = 1;
  // };
  setDistance(val) {
    this.limits.distance = val;
  };

  getLimits() {
    return this.limits;
  };
  //onClick() {};

  setDbConfig(config) {
    const temp = { ...this.dbConfig, ...config }
    this.dbConfig = temp;
  }

  getDbConfig() {
    return this.dbConfig;
  }

  addElement(mesh, geometry, texture, meshTypeName, x, y, z) {
    this[mesh] = new Mesh(geometry, new MeshBasicMaterial({ map: texture, side: DoubleSide, transparent: true }));
    this[mesh].visible = false;
    this[mesh].translateX(x);
    this[mesh].translateY(y);
    this[mesh].translateZ(z);
    this[mesh].type = meshTypeName;
    this[mesh].name = meshTypeName;
    // this[mesh].userData = {'editObjTitle'""};
    this.mesh.add(this[mesh]);

    if (meshTypeName === 'menuPosition') {
      this.mesh[meshTypeName] = this[mesh];
    }
  }

  editControls() {
    this.addElement('deleteMesh', textureToggleGeometry, delete_icon, 'delete', -27, 50, 5);
    this.addElement('settingsMesh', textureToggleGeometry, settings_icon, 'settings', 27, 50, 5);
  }

  showObjectMenu() {
    //TODO get back all modals
    // $(".add_screen_holder .modal-data").append($("#create-screen-settings"));
    // $(".link_holder .modal-data").append($(".link-obj-settings"));
    // $(".scenes_target_holder .modal-data").append($("#create-sceneChange-settings"));
    // $(".video_holder .modal-data").append($("#create-youtube-settings"));
    // $(".profile_holder .modal-content .modal-header").after($("#create-profile-settings"));

    // const txt = this.mesh.groupDetails.editTitle || '';
    // const dataLang = this.mesh.groupDetails.dataLang || 'empty';
    // $('.object-menu .object-name').text(txt);
    // $('.object-menu .object-name').attr('data-lang', dataLang);

    // $('.object-menu').addClass('is-active');
  }

  hideEditControls() {
    this.deleteMesh.visible = false;
    this.settingsMesh.visible = false;
  }

  getAxisRotations(mu = 'degrees') {
    if (this.dbConfig !== null) {
      const rotateX = this.dbConfig.hasOwnProperty('rotateX') ? this.dbConfig.rotateX : 0;
      const rotateY = this.dbConfig.hasOwnProperty('rotateY') ? this.dbConfig.rotateY : 0;

      if (mu === 'degrees') {
        return { 'rotateX': radians_to_degrees(rotateX), 'rotateY': radians_to_degrees(rotateY) };
      } else {
        return { rotateX, rotateY };
      }
    } else {
      return { 'rotateX': 0, 'rotateY': 0 };
    }
  }

  setAxisRotations(axis, angle) {
    const radAngle = degrees_to_radians(angle);

    this.mesh.lookAt(this.camera.position);

    if (axis === 'x') {
      this.mesh.rotateOnAxis(new Vector3(1, 0, 0), radAngle);
      this.mesh.rotateOnAxis(new Vector3(0, 1, 0), this.dbConfig.rotateY || 0);
      this.dbConfig.rotateX = radAngle;
    }

    if (axis === 'y') {
      this.mesh.rotateOnAxis(new Vector3(1, 0, 0), this.dbConfig.rotateX || 0);
      this.mesh.rotateOnAxis(new Vector3(0, 1, 0), radAngle);
      this.dbConfig.rotateY = radAngle;
    }
  }

  setInitRotations(set = false) {
    if (this.dbConfig) {
      const rotateX = this.dbConfig.hasOwnProperty('rotateX') ? this.dbConfig.rotateX : 0;
      const rotateY = this.dbConfig.hasOwnProperty('rotateY') ? this.dbConfig.rotateY : 0;

      if (rotateX) {
        this.withStaticRotations = true;
      }
      if (rotateY) {
        this.withStaticRotations = true;
      }

      if (set) {
        rotateX && (this.mesh.rotateOnAxis(new Vector3(1, 0, 0), rotateX));
        rotateY && (this.mesh.rotateOnAxis(new Vector3(0, 1, 0), rotateY));
      }
    }
  }

  resetRotations() {
    this.dbConfig.rotateX = 0;
    this.dbConfig.rotateY = 0;
    this.withStaticRotations = false;
  }

  setGeometry = (src, aspectRatio = 1, updateTexture = false) => {
    // console.log('setGeometry');
    if (src) {
      const max = 60;
      aspectRatio *= 1;

      let width = 1;
      let height = 1;

      if (aspectRatio < 0) {
        // portrait
        width = max * aspectRatio;
        height = max;
      } else {
        // landscape
        width = max;
        height = max / aspectRatio;
      }

      this.mesh.menuPosition.position.y = 0;
      this.mesh.menuPosition.translateY((height / 2 + 15) * -1);

      this.mesh.geometry = new PlaneGeometry(width, height);
      this.mesh.material.needsUpdate = true;
      updateTexture && textureLoader.load(src, texture => {
        this.mesh.material.map = texture;
        this.mesh.material.needsUpdate = true;
      });
    }
  }

  addMenuPosition = () => {
    let offset = this.mesh.geometry.type === 'CircleGeometry' ? this.mesh.geometry.parameters.radius : this.mesh.geometry.parameters.height / 2;
    offset += 15;

    this.addElement('menuPosition', menuPositionCircleGeometry, emptyTexture, 'menuPosition', 0, (offset * -1), -1);
  }

  addBorderHighlight = () => {
    this.borderMesh.material.color.setHex(0x3C6997);
    this.borderMesh.material.opacity = 1;
  }

  removeBorderHighlight = () => {
    this.borderMesh.material.color.setHex(0xffffff);
    this.borderMesh.material.opacity = .3;
  }

  updateTexture = (imagePath) => {
    this.mesh.material.map = textureLoader.load(imagePath);
  }

  getBorder = (w, h, r) => {
    //const r = 2;	// radius corner
    const s = 18;	// smoothness

    // helper const's
    const wi = w / 2 - r;
    const hi = h / 2 - r;
    const w2 = w / 2;
    const h2 = h / 2;
    const ul = r / w;
    const ur = (w - r) / w;
    const vl = r / h;
    const vh = (h - r) / h;

    let positions = [
      -wi, -h2, 0, wi, -h2, 0, wi, h2, 0,
      -wi, -h2, 0, wi, h2, 0, -wi, h2, 0,
      -w2, -hi, 0, -wi, -hi, 0, -wi, hi, 0,
      -w2, -hi, 0, -wi, hi, 0, -w2, hi, 0,
      wi, -hi, 0, w2, -hi, 0, w2, hi, 0,
      wi, -hi, 0, w2, hi, 0, wi, hi, 0
    ];

    let uvs = [
      ul, 0, ur, 0, ur, 1,
      ul, 0, ur, 1, ul, 1,
      0, vl, ul, vl, ul, vh,
      0, vl, ul, vh, 0, vh,
      ur, vl, 1, vl, 1, vh,
      ur, vl, 1, vh, ur, vh
    ];

    let phia = 0;
    let phib, xc, yc, uc, vc;

    for (let i = 0; i < s * 4; i++) {

      phib = Math.PI * 2 * (i + 1) / (4 * s);
      xc = i < s || i >= 3 * s ? wi : - wi;
      yc = i < 2 * s ? hi : -hi;
      positions.push(xc, yc, 0, xc + r * Math.cos(phia), yc + r * Math.sin(phia), 0, xc + r * Math.cos(phib), yc + r * Math.sin(phib), 0);

      uc = xc = i < s || i >= 3 * s ? ur : ul;
      vc = i < 2 * s ? vh : vl;
      uvs.push(uc, vc, uc + ul * Math.cos(phia), vc + vl * Math.sin(phia), uc + ul * Math.cos(phib), vc + vl * Math.sin(phib));
      phia = phib;

    }

    return [positions, uvs]
  }
}

export {
  VRObject3D
};