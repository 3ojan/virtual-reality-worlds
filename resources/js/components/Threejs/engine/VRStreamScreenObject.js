import {
  Mesh,
  MeshBasicMaterial,
  DoubleSide,
  VideoTexture,
  PlaneGeometry,
  BufferGeometry,
  BufferAttribute
} from 'three';


// import { SCENE_INTERACTION } from '../../constants/scene';
// import { WEBRTC_EVENTS } from '../../constants/webrtc';
// import { SCENE_EVENTS } from '../MVC/Model';

import { VRObject3D } from './VRObject3D';
import {
  shareScreenGeometry,
  borderShareScreenGeometry,
  screenShareTexture,
  borderMaterial,
} from './helpers/texturesAndGeometries';


class VRStreamScreenObject extends VRObject3D {

  constructor(containerName, camera, texture, x, y, z, model) {

    super(containerName);

    this.emptyScreen = true;
    this.userInfo = null;
    this.userId = null;

    this.isVideoTexture = false;
    this.screenShareElement = null;

    this.videoElement = null;

    this.shrScrn_userId = null;
    this.userRequestingId = null;
    this.screenStream = null;
    this.iShareOnIt = false;
    this.screenElHasSound = false;
    this.isScreenTexture = false;

    this.currentScreenId = null;
    this.current_userId = null;

    this.camera = camera;


    this.lastKnownAspectRatio = 0;

    this.limits = {
      min: 280,
      max: 1100,
      distance: 540
    }

    this.videoMaterial = new MeshBasicMaterial({
      side: DoubleSide,
      transparent: true,
      depthWrite: true,
      depthTest: true,
      // blending: NormalBlending
    });

    this.model = model;

    this.material = new MeshBasicMaterial({ map: screenShareTexture, side: DoubleSide, transparent: true, premultipliedAlpha: true });
    this.mesh = new Mesh(shareScreenGeometry, this.material);
    this.mesh.renderOrder = 1;

    // this.camera !== null ? this._setInitialPosRot() : this.setPosition(x, y, z);
    this.setPosition(x, y, z);

    this.mesh.type = 'screenStream';
    this.mesh.name = 'screenStream';
    this.name = 'screenStream';

    this.isPublic = this.model.publicStage;

    this.add(this.mesh);

    this.mesh.groupDetails = { title: this.model.languageObject['screen-share'].text, icon: 'screen_share', editTitle: this.model.languageObject['edit-screen-share'].text, dataLang: 'edit-screen-share' }

    this.editControls();
    // this.deleteMesh.scale.set(5,5,5);
    // this.deleteMesh.translateX(-140);
    // this.deleteMesh.translateY(180);
    // this.deleteMesh.translateZ(50);
    // this.settingsMesh.scale.set(5,5,5);
    // this.settingsMesh.translateX(140);
    // this.settingsMesh.translateY(180);
    // this.settingsMesh.translateZ(50);


    const self = this;

    if (model) {

      if (!this.model.editMode) {
        this.borderMesh = new Mesh(borderShareScreenGeometry, borderMaterial);
        this.borderMesh.renderOrder = 0;
        // this.borderMesh.visible = false;
        this.mesh.add(this.borderMesh);
      }

      this.model.addEventListener(SCENE_INTERACTION.SCENE_INITIALISED, function (e) {

        if (!e.data || !e.data.currentUsers || !e.data.currentUsers.occupiedScreens) {//
          return
        }

        if (e.data.currentUsers.occupiedScreens) {

          // console.log('SCENE_INITIALISED', e.data);
          const payload = e.data.payload;
          const _userData = e.data.currentUsers;
          const userId = payload.senderId;

          const id = self.dbConfig.id;
          //console.log('self.dbConfig.id', self.dbConfig.id);
          if (_userData.occupiedScreens[id]) {
            const peerID = e.data.currentUsers.occupiedScreens[id];
            const userData = _userData[peerID];
            self.userInfo = userData;
            self.userId = peerID;
          }
        }

      });

      //ME
      this.model.addEventListener(WEBRTC_EVENTS.WEBRTC_USER_STARTED_SCREEN_SHARE, function (e) {
        //const obj_id = self.dbConfig.id;
        if (e.data.unique_id === self.dbConfig.id) {
          // console.log('WEBRTC_USER_STARTED_SCREEN_SHARE',e.data);
          // self.startScreenSharing(document.getElementById('initial-screen-share-video'), e.data.userScreenShareOn, e.data.unique_id);
          // self.screenStream = document.getElementById('initial-screen-share-video').srcObject.getVideoTracks()[0];
          // self.handleStopSharing(self.screenStream, e.data.unique_id);
        }
      });

      this.model.addEventListener(SCENE_INTERACTION.USER_STOP_SCREEN, (e) => {
        // const obj_id = self.dbConfig.id;
        if (e.data.id === self.dbConfig.id) { //TODO
          // console.log('USER_STOP_SCREEN ',e.data);
          // self.c urrentScreenId = null;
          // self.updateUserScreenShateState(false);
        }

      });

      //PEERS

      this.model.addEventListener(WEBRTC_EVENTS.WEBRTC_SOME_SCREEN_SHARE_STARTED, (e) => {
        const { userId, userScreenShareOn, objId, streamId } = e.data;
        console.log('WEBRTC_SOME_SCREEN_SHARE_STARTED', e.data);
        // console.log('isSomeoneScreenSharing',self.model.isSomeoneScreenSharing);
        if (userScreenShareOn) {
          if (userId !== null) {
            if (objId === self.dbConfig.id) {
              console.log('WEBRTC_SOME_SCREEN_SHARE_STARTED', e.data);
              self.shrScrn_userId = userId;
              self.startScreenSharing(document.getElementById(`screenShareVideo_${streamId}`), userScreenShareOn, objId);
            }
          }
        }

      });


      this.model.addEventListener(SCENE_INTERACTION.SET_OCCUPIED_SCREENS, function (e) {

        if (!e.data || !e.data.payload.occupiedScreens || !e.data.payload.userId) {
          return
        }
        const id = self.dbConfig.id;
        if (e.data.payload.occupiedScreens[id] !== null) {
          console.log('%c SET_OCCUPIED_SCREENS', 'background: greenyellowl padding:10px');
          console.log('%c occupiedScreens', e.data.payload.occupiedScreens[id]);
          //TODO publicStage
        }

      });

      this.model.addEventListener(SCENE_EVENTS.SOMEONE_CHANGED_DATA, (e) => {

        if (self.shrScrn_userId !== null) {
          console.log('SOMEONE_CHANGED_DATA  shrScrn_userId', self.shrScrn_userId);
          console.log('SOMEONE_CHANGED_DATA  this.userId', self.userId);
          if (e.data[self.shrScrn_userId]) {
            const userScreenShareOn = e.data[self.shrScrn_userId].userScreenShareOn;
            //console.log('userScreenShareOn', userScreenShareOn);
            if (self.screenShareElement === null || self.screenShareElement === undefined) {
              // console.log('SCENE_EVENTS.SOMEONE_CHANGED_DATA',e.data);
              if (document.getElementById(`screenShareVideo_${self.shrScrn_userId}`) !== null) {
                //console.log('screenShareVideo_ exists');
                self.screenShareElement = document.getElementById(`screenShareVideo_${self.shrScrn_userId}`);
                self.updateUserScreenShateState(userScreenShareOn);
              }

            } else {
              // console.log('e.data[shrScrn_userId]',e.data[self.shrScrn_userId]);
              // console.log('userScreenShareOn',userScreenShareOn);
              //TODO remove screen 
              // console.log('self.model.myWebcamStreamId',self.model.myWebcamStreamId);
              // console.log('self.model.iShareScreen',self.model.iShareScreen);
              if (!self.model.myWebcamStreamId && !self.model.iShareScreen) {
                self.updateUserScreenShateState(false);
              }
            }
          }
        }

        if (this.isPublic && this.model.guestJoinedPublicStage && e.data.occupiedScreens) {
          if (e.data.occupiedScreens[self.dbConfig.id] != null) {
            let userId = e.data.occupiedScreens[this.dbConfig.id];
            let userScreenShareOn = e.data[userId].userScreenShareOn;
            if (userScreenShareOn) {
              //console.log('SOMEONE_CHANGED_DATA', e.data[userId]);
              let userName = e.data[userId].userName;
              console.log('%c PUUUBLIC screenshare ON by ' + userName, 'background:green');
              // console.log(e.data[userId]);
              let streamId = e.data[userId].screenStreamId;
              // console.log(this.userId);
              let userVideoOn = e.data[userId].userVideoOn;
              let userScreenShareOn = e.data[userId].userScreenShareOn;
              let videoId = 'screenShareVideo_' + streamId;
              let unique_id = self.dbConfig.id;
              console.log('this.unique_id', this.unique_id);
              // Create public stage video
              // console.log('for public video!!! I join, somebody already streaming',e.data[userId]);
              // if (self.screenShareElement === null || self.screenShareElement === undefined) {
              // }
              this._createPublicScreenShareElement(e.data[userId]);
              this.model.dispatchEvent({ type: WEBRTC_EVENTS.GET_PUBLIC_STREAM, data: { streamId, videoId, userId, userVideoOn, userScreenShareOn, unique_id } });
            }
          }
        }

      });


      this.model.addEventListener(WEBRTC_EVENTS.YOUR_SCREEN_DENIED, (e) => {
        const { scopeId } = e.data;
        console.log('YOUR_SCREEN_DENIED', e.data);

      });
      this.model.addEventListener(WEBRTC_EVENTS.YOUR_SCREEN_APPROVED, (e) => {
        const { callInitiatorID, scopeId, objID } = e.data;

        if (objID === this.dbConfig.id) {
          self.takeScreenAfterApproved(true, 'initial-screen-share-video', objID)
        }

      });

      this.model.addEventListener(WEBRTC_EVENTS.SET_PUBLIC_STREAM, (e) => {
        if (e.data.objId == this.dbConfig.id) {
          if (e.data.userScreenShareOn) {
            let elementId = document.getElementById('screenShareVideo_' + e.data.streamId); //`screenShareVideo_${streamId}`
            if (elementId.srcObject != null) {
              console.log('SET_PUBLIC_STREAM', e.data);
              this.startScreenSharing(elementId, e.data.userScreenShareOn, e.data.objId);
            }
          }
        }

      });

      // this.model.addEventListener(WEBRTC_EVENTS.WEBRTC_I_STOP_BROADCASTING, (e) => {
      //   console.log('WEBRTC_I_STOP_BROADCASTING');
      //   self.updateUserScreenShateState(false);

      //   // self.handleStopSharing(self.screenStream, self.dbConfig.id);
      // });

    }
    return this;
  }



  _createPublicScreenShareElement = (userData) => {
    //screenShareVideo_
    let streamId = userData.screenStreamId;
    if (!streamId) {
      // console.log('no stream id!');
      return;
    }
    if ($(`#screenShareVideo_${streamId}`).length > 0) {
      return;
    }
    console.log('_createRemoteScreenShare', userData);

    var vidContainer = document.createElement('div');
    vidContainer.setAttribute('id', 'remoteScreenShareVideo_' + userData.userId);
    vidContainer.setAttribute('class', 'video-wrapper square');

    var videoElement = document.createElement('video');
    videoElement.setAttribute('autoplay', true);
    videoElement.setAttribute('playsinline', true);
    videoElement.setAttribute('id', `screenShareVideo_${streamId}`);
    vidContainer.appendChild(videoElement);

    let peerImg = document.createElement('img');
    peerImg.innerHTML = `<img src="${userData.avatar}" alt="Avatar" class="avatar-img ${userData.userId}"`;
    vidContainer.appendChild(peerImg);

    // vidContainer.appendChild(this._generateLabelElement(displayName, userId));

    $('#localVideoContainer').append(vidContainer);
    this.screenShareElement = document.getElementById(`screenShareVideo_${streamId}`);
    let unique_id = this.unique_id;
    console.log('this.screenShareElement', this.screenShareElement);
    // if(this.screenShareElement.srcObject != null){

    this.startScreenSharing(this.screenShareElement, true, unique_id);
    // }
  }

  takeScreenAfterApproved(isOn, elementId, objID) {
    //this.takeScreen(isOn, id, objID); 
    if (this.unique_id === objID) {

      this.model.dispatchEvent({ type: WEBRTC_EVENTS.WEBRTC_START_SCOPE, data: { 'scopeType': 'screenShare', 'scopeId': this.model.currentScene.id, 'scopeName': this.model.currentScene.publicName, 'withCamera': false, 'withAudio': false, 'constraints': {}, 'removeElement': null, 'unique_id': objID } });
      this.model.iShareOnThisObj = this;
      this.currentScreenId = objID;
      // console.log('%c currentScreenId:' + this.currentScreenId, 'background:#e78cf4');
      // console.log('%c this.dbConfig.id:' + this.dbConfig.id, 'background:#e78cf4');
      this.startScreenSharing(document.getElementById(elementId), true, objID);
    }
  }

  updateUserScreenShateState(state) {
    if (this.screenShareElement !== null && this.screenShareElement !== undefined) {

      if (state) {
        this.mesh.material = this.videoMaterial;
        // console.log('show my video');
        $("#screen-share-video").parent().css({ "display": "block" });
      } else {
        //Screen share stoped
        console.log('%c Screen share stoped', 'background:red');
        // this.removeCheckSharedWindowSize();
        this.mesh.geometry = new PlaneGeometry(480, 360);
        // this.mesh.material = this.material;
        this.mesh.material.needsUpdate = true;
        this.emptyScreen = true;
        this.model.iShareOnThisObj = null;
        this.lastKnownAspectRatio = 0;

        if (this.shrScrn_userId !== null) {
          console.log('remove() #screenShareVideo_', this.shrScrn_userId);
          // $(`#screenShareVideo_${this.shrScrn_userId}`).parent().remove();
          // $("#screen-share-video").parent().css( {"width":0,"height":0, "display": "none"} );
        }
        if (this.model.iShareScreen === false) {
          //hide my video
          $("#screen-share-video").parent().css({ "width": 0, "height": 0, "display": "none" });
        }

        this.emptyScreen = true;
        this.shrScrn_userId = null;
        this.screenStream = null;
        this.model.activeScreenObj = null;
        this.model.isSomeoneScreenSharing = false;


        this.mesh.visible = false;
        // console.log('this.mesh',this.mesh);
        $(`.indicator-${this.mesh.id}`).removeClass('taken');
        $("#screen-share-menu").removeClass("is-active");


      }
    }
  }

  triggerStopBtn() {
    console.log('triggerStopBtn');
    // console.log(this.screenStream);
    // this.screenStream.enabled = false;

    if (!this.iShareOnIt) {
      this.model.alert('error', this.model.languageObject['error-action-stop-screen-share'].text);
      return;
    }

    let tracks = document.getElementById('initial-screen-share-video').srcObject.getTracks();
    tracks.forEach(track => track.stop());
    this.emptyScreen = true;
    this.isScreenTexture = false;
    // this.mesh.material = this.material;
    this.shrScrn_userId = null;
    this.screenStream = null;
    this.model.iShareScreen = false;
    // console.log('this.dbConfig',this.dbConfig);
    this.model.onStopScreen(this.dbConfig);
    this.model.dispatchEvent({ type: WEBRTC_EVENTS.WEBRTC_STOP_SCREEN_SHARE });
    // this.screenStream.srcObject = null;
    this.mesh.visible = false;
    $(`.indicator-${this.mesh.id}`).removeClass('taken');
    $("#screen-share-menu").removeClass("is-active");
    // this.removeBorderHighlight();
  }

  handleStopSharing(screenShareElement, unique_id) {
    this.screenStream.addEventListener('ended', () => {
      // this.removeCheckSharedWindowSize();
      console.log('handleStopSharing');
      if (!this.model.iShareScreen) {
        // return;
      }
      this.model.iShareScreen = false;
      this.emptyScreen = true;
      this.iShareOnIt = false;
      this.mesh.geometry = new PlaneGeometry(480, 360);
      this.mesh.material = this.material;
      this.mesh.material.needsUpdate = true;
      //TODO dispatch custom event here 
      this.model.onStopScreen(this.dbConfig);
      this.model.dispatchEvent({ type: WEBRTC_EVENTS.WEBRTC_STOP_SCREEN_SHARE });
      // this.c urrentScreenId = null;
      this.shrScrn_userId = null;
      this.screenStream = null;
      this.lastKnownAspectRatio = 0;
      this.borderMesh.visible = false;
      if (this.model.iShareOnThisObj === null) {//TODO
        // console.log('NOT ME!');
        //hid if user opened grid mode
        $("#screen-share-video").parent().css({ "width": 0, "height": 0, "display": "none" });
        $("#stopScreenShare").hide();
      } else {
        $("#stopScreenShare").show();
      }
      this.mesh.visible = false;
      $(`.indicator-${this.mesh.id}`).removeClass('taken');
      $("#screen-share-menu").removeClass("is-active");
      this.removeBorderHighlight();
    });
  }


  startScreenSharing(screenShareElement, userScreenShareOn, unique_id) {

    // console.log('screenShareElement',screenShareElement);

    this.screenShareElement = screenShareElement;

    if (userScreenShareOn === undefined) {
      return;
    }
    const isScreen = screenShareElement.srcObject !== null;
    let screenEnabled;

    if (screenShareElement.srcObject !== null) {
      if (isScreen) {
        screenEnabled = screenShareElement.srcObject.getVideoTracks()[0].enabled;
        if (screenEnabled) {
          if (this.dbConfig.id === unique_id) {
            console.log('%c startScreenSharing', 'color:purple; font-weight:bold');
            if (this.model.iShareOnThisObj === null) {
              $("#stopScreenShare").hide();
            } else {
              $("#stopScreenShare").show();
            }

            const lng = this.model.languageObject;

            if (this.screenHasSound(screenShareElement)) {
              $("#toggleScreenShareAudio").removeClass("disabled");
              $("#toggleScreenShareAudio p").text(lng["mute-text"].text);
              $("#toggleScreenShareAudio p").attr("data-lang", "mute-text");
              $("#toggleScreenShareAudio span").html("volume_up");
            } else {
              $("#toggleScreenShareAudio").addClass("disabled");
              $("#toggleScreenShareAudio p").text(lng["unmute-text"].text);
              $("#toggleScreenShareAudio p").attr("data-lang", "unmute-text");
              $("#toggleScreenShareAudio span").html("volume_off");
            }

            this.screenStream = screenShareElement.srcObject.getVideoTracks()[0];
            this.videoElement = screenShareElement;
            this.setScreenGeometry();
            this.addResizeScreenListener();
            this.videoMaterial.map = new VideoTexture(screenShareElement);
            this.mesh.material = this.videoMaterial;
            this.emptyScreen = false;
            this.isScreenTexture = true;
            // if(this.model.iShareScreen){
            //   console.log('this.model.iShareScreen ', this.model.iShareScreen);
            // }
            this.handleStopSharing(this.screenStream, unique_id);
            if (this.model.iShareOnThisObj === null) {//TODO
              // console.log('NOT ME!');
              //hid if user opened grid mode
              $("#screen-share-video").parent().css({ "width": 0, "height": 0, "display": "none" });
            }
            this.mesh.visible = true;
            $(`.indicator-${this.mesh.id}`).addClass('taken');

            if (this.screenShareElement.id === 'initial-screen-share-video') {
              this.screenShareElement = document.getElementById("screen-share-video");
            }
          }

        }
      }

    }
    return isScreen;
  }

  takeScreen(isVideoTextureOn = true, videoId = 'initial-screen-share-video', objID) {

    //TODO find right object id here
    this.screenShareElement = null;
    this.screenShareElement = videoId !== null ? document.getElementById(videoId) : null;
    this.iShareOnIt = true;
    this.emptyScreen = false;
    this.addResizeScreenListener();

  }

  getOwnerId() {
    return this.model.config.creatorUserIdOfWorld;
  }

  requestOwnerToShareScreen(ownerId, objID, scopeId, scopeName) {
    this.model.dispatchEvent({ type: WEBRTC_EVENTS.REQUEST_SCREEN_SHARE, data: { ownerId: ownerId, objID: objID, scopeId: scopeId, scopeName: scopeName } });
  }

  ownerShareScreen(ownerId, objID) {
    this.model.dispatchEvent({ type: WEBRTC_EVENTS.OWNER_SCREEN_SHARE, data: { ownerId: ownerId, objID: objID } });
  }

  iShareScreen() {
    return this.model.iShareScreen; //this.model.iShareOnThisObj;
  }

  screenHasSound(el) {
    let tracks = el.srcObject.getTracks();
    tracks.forEach(track => {
      // console.log(track);
      if (track.kind == 'audio') {
        this.screenElHasSound = true;
      }
    });
    return this.screenElHasSound;
  }

  isMuted() {
    if (this.screenShareElement === null) {
      return false;
    }

    let enabled = false;
    this.screenShareElement.srcObject.getAudioTracks().forEach((track) => {
      enabled = track.enabled;
      // console.log(track);
    });
    return enabled;
  }

  isEmpty() {
    return this.emptyScreen;
  }

  isMine() {
    return this.iShareOnIt;
  }

  toggleAudio = () => {
    if (this.screenShareElement === null)
      return;

    const state = this.isMuted();

    this.screenShareElement.srcObject.getAudioTracks().forEach((track) => {
      track.enabled = !state;
      // console.log(track);
    });

    const lng = this.model.languageObject;

    $("#toggleScreenShareAudio p").text(state ? lng["unmute-text"].text : lng["mute-text"].text);
    $("#toggleScreenShareAudio p").attr("data-lang", state ? "unmute-text" : "mute-text");
    $("#toggleScreenShareAudio span").html(state ? "volume_off" : "volume_up");
  }

  setScreenGeometry = () => {
    // console.log('setScreenGeometry  ',this.screenStream.getSettings());
    let aspectRatio = this.screenStream.getSettings().aspectRatio;
    if (aspectRatio == undefined) {
      aspectRatio = 16 / 9;
    }
    let w = 1;
    let h = 1;

    if (aspectRatio < 1) {
      // portrait
      w = 360 * aspectRatio;
      h = 360;
    } else {
      // landscape
      w = 480;
      h = 480 / aspectRatio;
    }

    this.lastKnownAspectRatio = aspectRatio;

    let videoGeometry = this.getBorder(w, h, 2);

    this.mesh.menuPosition.position.y = 0;
    this.mesh.menuPosition.translateY((h / 2 + 15) * -1);

    this.mesh.geometry = new BufferGeometry();
    this.mesh.geometry.setAttribute('position', new BufferAttribute(new Float32Array(videoGeometry[0]), 3));
    this.mesh.geometry.setAttribute('uv', new BufferAttribute(new Float32Array(videoGeometry[1]), 2));

    let videoBorderGeometry = this.getBorder(w + 4, h + 4, 2);
    this.borderMesh.geometry = new BufferGeometry();
    this.borderMesh.geometry.setAttribute('position', new BufferAttribute(new Float32Array(videoBorderGeometry[0]), 3));
    this.borderMesh.geometry.setAttribute('uv', new BufferAttribute(new Float32Array(videoBorderGeometry[1]), 2));
    this.mesh.add(this.borderMesh);
    this.borderMesh.visible = true;

    this.mesh.material.needsUpdate = true;

  }

  addResizeScreenListener = () => {
    this.screenShareElement.addEventListener('resize', () => {
      if (!this.screenStream) return;
      const aspectRatio = this.screenStream.getSettings().width / this.screenStream.getSettings().height;
      (this.lastKnownAspectRatio !== aspectRatio) && this.setScreenGeometry();
    });
  }

}

export { VRStreamScreenObject };