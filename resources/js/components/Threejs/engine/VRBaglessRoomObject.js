import {
  Mesh,
  DoubleSide,
  MeshBasicMaterial,
  PlaneGeometry,
  BufferGeometry,
  BufferAttribute
} from 'three';

import { VRObject3D } from './VRObject3D';
import { textureLoader, linkGeometry, borderMaterial } from './helpers/texturesAndGeometries';


class VRBaglessRoomObject extends VRObject3D {

  constructor(containerName, camera, texture, x, y, z, model) {

    super(containerName);

    this.model = model;
    this.camera = camera;
    this.link = '';
    this.material = new MeshBasicMaterial({ map: texture, side: DoubleSide, transparent: true });

    this.mesh = new Mesh(linkGeometry, this.material);
    this.mesh.type = 'baglessRoom';
    this.mesh.name = 'baglessRoom';
    this.name = 'baglessRoom';

    this.borderMesh = new Mesh(linkGeometry, borderMaterial);
    this.borderMesh.renderOrder = -1;
    this.borderMesh.type = 'baglessRoom';
    this.mesh.add(this.borderMesh);

    this.targetRoomName = '';

    // INIT
    // this.camera !== null ? this._setInitialPosRot() : this.setPosition(x, y, z);
    this.setPosition(x, y, z);

    this.add(this.mesh);

    // this.mesh.groupDetails = { title: this.model.languageObject['bagless-room'].text, icon: 'share', editTitle: this.model.languageObject['edit-bagless-room'].text, dataLang: 'edit-bagless-room' }

    this.editControls();
    this.settingsMesh && (this.settingsMesh.visible = false);

    //result
    return this;
  }

  setLink = (link) => {
    this.link = link;
  }

  getLink = () => {
    return this.link;
  }

  setDbConfig(config, forceUrl = false) {
    super.setDbConfig(config);

    if (!this.dbConfig.hasOwnProperty("image")) return;
    if (this.dbConfig.image.url === "") return;
    const { roomId } = this.dbConfig;

    if (roomId && !forceUrl) {
      const successCallback = (response) => {
        const url = response.previewBackgroundImage;
        this.targetRoomName = response.roomName;

        textureLoader.load(url, (texture) => {
          this.mesh.material.map = texture;
          const aspect = texture.image.naturalWidth / texture.image.naturalHeight;
          this.setGeometry(url, aspect);
        });
      };

      // this.model.worldFetcher.getWorldDataFromId(Number(roomId), successCallback);
    }
  }

  setGeometry = (src, aspectRatio = 1, updateTexture = false) => {
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

      const borderGeometry = this.getBorder(width + 4, height + 4, 2);
      this.borderMesh.geometry = new BufferGeometry();
      this.borderMesh.geometry.setAttribute('position', new BufferAttribute(new Float32Array(borderGeometry[0]), 3));
      this.borderMesh.geometry.setAttribute('uv', new BufferAttribute(new Float32Array(borderGeometry[1]), 2));

      this.mesh.material.needsUpdate = true;

      updateTexture && textureLoader.load(src, texture => {
        this.mesh.material.map = texture;
        this.mesh.material.needsUpdate = true;
      });
    }
  }
}

export { VRBaglessRoomObject };