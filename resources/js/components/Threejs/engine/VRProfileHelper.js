import {
  Mesh,
  MeshBasicMaterial,
  DoubleSide
} from 'three';

import { VRObject3D } from './VRObject3D';

import {
  moodCircleGeometry,
  chairCircleGeometry,
  green_mood,
  yellow_mood,
  red_mood,
  borderCircleGeometry,
  borderMaterial,
  inTalkTexture
} from './helpers/texturesAndGeometries';



class VRProfileHelper extends VRObject3D {

  constructor(containerName, camera, texture, model) {
    super(containerName);

    this.model = model;
    this.userId = null;
    this.userInfo = null;
    this.userData = null;

    this.mood = null;

    this.camera = camera;

    this.material = new MeshBasicMaterial({ map: texture, side: DoubleSide, transparent: true })
    return this;
  }

  getUserInfo() {
    return this.userInfo;
  }

  hideUserOptions() {
    // $("#room-owner-menu").removeClass("is-active");
  }

  addAsFriend() {
    // this.model.worldFetcher.addAsFriend(this.userId, (response) => {
    //   this.model.onFriendAddedSuccess(response);
    // });
  }

  initiateVideoCall() {
    // this.model.dispatchEvent({ type: WEBRTC_EVENTS.WEBRTC_VIDEO_ONE_ON_ONE, data: { item: this.userData } });
    this.hideUserOptions();
  }

  initiateChat() {
    // this.model.dispatchEvent({ type: SCENE_EVENTS.ONE_ON_ONE_CHAT, item: this.userData });
    this.hideUserOptions();
  }

  showOrUpdateMood(index) {

    this.mood = parseInt(index);

    let moodTexture = null;
    switch (this.mood) {
      case 1: moodTexture = green_mood; break;
      case 2: moodTexture = yellow_mood; break;
      case 3: moodTexture = red_mood; break;
    }

    if (moodTexture !== null) {
      this.moodMaterial.map = moodTexture;
      this.moodMesh.visible = true;
    }
  }

  addBusyOnCall() {
    this.busyMaterial = new MeshBasicMaterial({ map: inTalkTexture, side: DoubleSide, transparent: true });
    this.busyMesh = new Mesh(chairCircleGeometry, this.busyMaterial);
    this.busyMesh.type = 'busy';
    this.busyMesh.name = 'busy';
    this.busyMesh.renderOrder = 5;
    this.busyMesh.visible = false;
    // this.busyMesh.translateZ(1);
    this.mesh.add(this.busyMesh);
  }

  addMood() {
    this.moodMaterial = new MeshBasicMaterial({ map: green_mood, side: DoubleSide, depthWrite: false, transparent: true });
    this.moodMesh = new Mesh(moodCircleGeometry, this.moodMaterial);
    this.moodMesh.type = 'mood';
    this.moodMesh.name = 'mood';
    this.moodMesh.renderOrder = 0; // rendered always behing chair mesh without z-fighting
    this.moodMesh.visible = false;
    this.moodMesh.translateZ(-5);
    this.mesh.add(this.moodMesh);
  }

  addBorder() {
    this.borderMesh = new Mesh(borderCircleGeometry, borderMaterial);
    this.borderMesh.renderOrder = -1;
    this.borderMesh.translateZ(-6);
    this.mesh.add(this.borderMesh);
  }

}

export { VRProfileHelper };