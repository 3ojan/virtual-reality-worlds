import {
  Mesh,
  DoubleSide,
  VideoTexture,
  ShaderMaterial
} from 'three';

// import gsap, { RoughEase, Linear } from 'gsap/all';
// import { SCENE_INTERACTION } from '../../constants/scene';
// import { WEBRTC_EVENTS } from '../../constants/webrtc';
// import { SCENE_EVENTS } from '../MVC/Model';
import { videoTextureShaderProps } from './constants/shader';

import { VRProfileHelper } from './VRProfileHelper';
import { animateCamera } from './helpers/worldHelpers';

import {
  chairCircleGeometry,
  chairPlaneGeometry,
  textureLoader,
  defaultTexture
} from './helpers/texturesAndGeometries';
// import { GLOBAL_EVENTS } from '../../constants/global';


class VRChairObject extends VRProfileHelper {

  constructor(containerName, camera, texture, x, y, z, model) {

    super(containerName, camera, texture, model);

    this.iSitOnIt = false;
    this.emptySeat = true;

    this.limits = {
      min: 115,
      max: 570,
      distance: 300
    }
    this.isVideoTexture = false;
    this.videoElement = null;

    this.requestAudioLevels = false;
    this.averageVolume = 0;
    this.requestFakeAnimation = true;

    this.videoMaterial = new ShaderMaterial({
      uniforms: {
        tex: {
          value: null
        },
        ratio: {
          value: 0
        },
        isPortrait: {
          value: false
        }
      },
      side: DoubleSide,
      transparent: true,
      depthWrite: true,
      depthTest: true,
      vertexShader: videoTextureShaderProps.vertexShader,
      fragmentShader: videoTextureShaderProps.fragmentShader,
    });

    this.emptySeatTexture = texture;

    // this.mesh = new Mesh(this.model.editMode ? chairPlaneGeometry : chairCircleGeometry, this.material);
    this.mesh = new Mesh(chairCircleGeometry, this.material);

    this.mesh.renderOrder = 1;
    this.mesh.type = 'guestSeat';
    this.mesh.name = 'guestSeat';
    this.name = 'guestSeat';

    this.isPublic = false;
    // this.isPublic = this.model.publicStage;

    this.add(this.mesh);
    // this.camera !== null ? this._setInitialPosRot() : this.setPosition(x, y, z);
    this.setPosition(x, y, z);
    console.log(x, y, z, this.mesh.name)

    // this.mesh.groupDetails = { title: this.model.languageObject['chair'].text, icon: 'chair', editTitle: this.model.languageObject['edit-chair'].text, dataLang: 'edit-chair' }

    this.editControls();
    this.addMood()

    // !this.model.editMode && this.addMood();
    // !this.model.editMode && this.addBorder();
    // !this.model.editMode && this.addBusyOnCall();

    const self = this;

    screen.orientation && screen.orientation.addEventListener('change', this.fixRaportRatio); // TODO - walkaround for screen on safari browser

    // if (model) {
    //   this.model.addEventListener(SCENE_INTERACTION.SET_OCCUPIED_SEATS, function (e) {
    //     if (!e.data || !e.data.currentUsers || !e.data.currentUsers.occupiedSeats) {
    //       return
    //     }
    //     const _userData = e.data.currentUsers;
    //     const { occupiedSeats } = _userData;
    //     const id = self.dbConfig.id;
    //     if (occupiedSeats && occupiedSeats[id]) {
    //       // console.log('SET_OCCUPIED_SEATS', e.data, id);
    //       // console.log('SCENE_INTERACTION.SET_OCCUPIED_SEATS', e.data)
    //       const peerID = e.data.currentUsers.occupiedSeats[id];
    //       const userData = _userData[peerID];
    //       self.userInfo = userData;
    //       self.userId = peerID;
    //       // console.log('occupySeat with userData', userData);
    //       !self.iSitOnIt && self.occupySeat(userData);
    //       self.iSitOnIt && self.showOrUpdateMood(userData.currentUserMood);
    //     } else {
    //       !self.iSitOnIt && self.standUp();
    //     }
    //   });

    // this.model.addEventListener(SCENE_INTERACTION.SCENE_INITIALISED, function (e) {

    //   if (!e.data || !e.data.currentUsers || !e.data.currentUsers.occupiedSeats) {
    //     return
    //   }
    //   const payload = e.data.payload;
    //   const _userData = e.data.currentUsers;
    //   const userId = payload.senderId;

    //   const id = self.dbConfig.id;
    //   if (e.data.currentUsers.occupiedSeats[id]) {
    //     // console.log('SCENE_INTERACTION.SCENE_INITIALISED', e.data)
    //     // console.log(id, e.data.currentUsers.occupiedSeats[id])
    //     const peerID = e.data.currentUsers.occupiedSeats[id];
    //     const userData = _userData[peerID];
    //     self.userInfo = userData;
    //     self.userId = peerID;
    //     self.occupySeat(userData);
    //     // console.log('user which was already in the scene', userData)
    //   } else {
    //     self.standUp();
    //   }
    // });

    // this.model.addEventListener(SCENE_INTERACTION.JUMP_TO_USER, (e) => {
    //   console.log(e, this.dbConfig)
    //   if (e.data === self.dbConfig.id) {
    //     animateCamera(this.camera, this.mesh, this.model.onAnimationStart, this.model.onAnimationStop)
    //   }
    // });

    // this.model.addEventListener(SCENE_EVENTS.SOMEONE_CHANGED_DATA, (e) => { // MOOD OR VIDEO STATE
    //   // console.log('SOMEONE_CHANGED_DATA',this.userId);
    //   if (this.userId !== null && !this.iSitOnIt) {
    //     if (e.data[this.userId]) {
    //       console.log('SOMEONE_CHANGED_DATA', e.data, this.userId);
    //       const mood = e.data[this.userId].currentUserMood;
    //       const userVideoOn = e.data[this.userId].userVideoOn;
    //       const on1on1Call = e.data[this.userId].on1on1Call;

    //       this.showOrUpdateMood(mood);
    //       this.setBusyTexture(on1on1Call);

    //       if (this.videoElement === null || this.videoElement === undefined) {

    //         console.log('this.videoElement is null');
    //         if (document.getElementById(`remoteVideo${e.data[this.userId][this.webcamStreamId]}`) !== null) {
    //           this.videoElement = document.getElementById(`remoteVideo${e.data[this.userId][this.webcamStreamId]}`);//document.getElementById(`remoteVideo_${this.userId}`);
    //           if (this.videoElement.srcObject !== null) {
    //             console.log('---this.videoElement', this.videoElement);
    //           } else {
    //             this.startVideo(this.videoElement, userVideoOn);
    //             userVideoOn ? $(this.videoElement).parent().removeClass('hidden') : $(this.videoElement).parent().addClass('hidden');
    //           }
    //         }
    //         // Create public stage video
    //         if (this.isPublic && this.model.guestJoinedPublicStage) {
    //           console.log('for public video!!! I join, somebody already streaming', e.data[this.userId]);
    //           this.createPublicVideoElement(e.data[this.userId]);
    //         }
    //       } else {
    //         console.log('this.videoElement !null');
    //         // console.log('e.data[this.userId]',e.data[this.userId]);
    //         // console.log('userVideoOn',userVideoOn);
    //         this.updateUserVideoState(userVideoOn);
    //         let texture = e.data[this.userId].userAvatarUrl
    //         if (!userVideoOn) {
    //           // console.log('!userVideoOn');
    //           this.setAvatarImage(texture, true);
    //         }
    //         if (!this.isPublic) {
    //           if (!self.model.iShareScreen && !self.model.myWebcamStreamId) {
    //             console.log('I dont share anything');
    //             this.setAvatarImage(texture, true);
    //           }
    //         } else {
    //           let streamId = e.data[this.userId].webcamStreamId;
    //           let userId = e.data[this.userId].userId;
    //           let userVideoOn = e.data[this.userId].userVideoOn;
    //           let userScreenShareOn = e.data[this.userId].userScreenShareOn;
    //           let videoId = 'remoteVideo' + streamId;
    //           let unique_id = this.dbConfig.id;
    //           console.log('%c PUUUBLIC userVideoOn: ' + userVideoOn + '  userScreenShareOn: ' + userScreenShareOn, 'background:green');
    //           // console.log(e.data[this.userId]);
    //           this.model.dispatchEvent({ type: WEBRTC_EVENTS.GET_PUBLIC_STREAM, data: { streamId, videoId, userId, userVideoOn, userScreenShareOn, unique_id } });
    //         }
    //       }
    //     }
    //   }
    // });

    // this.model.addEventListener(SCENE_INTERACTION.USER_MOOD_CHANGED, (e) => {
    //   if (this.iSitOnIt) {
    //     this.showOrUpdateMood(e.data.mood);
    //   }
    // });

    // this.model.addEventListener(WEBRTC_EVENTS.SET_PUBLIC_STREAM, (e) => {
    //   // if (e.data.userScreenShareOn) { //TODO can be both
    //   //   return;
    //   // }
    //   // return;
    //   const { streamId, videoId, userId, userVideoOn, userScreenShareOn, objId, streamWidth, streamHeight } = e.data;
    //   if (this.dbConfig.id !== objId) {
    //     // console.log('not this obj return!');
    //     return;
    //   }
    //   if (this.userId !== null) {
    //     if (userId === this.userId) {
    //       if (userVideoOn) {
    //         console.log('SET_PUBLIC_STREAM', e.data);
    //         this.startVideo(document.getElementById(`remoteVideo${streamId}`), userVideoOn, streamId, streamWidth, streamHeight);
    //         $(`#video_${userId}`).removeClass('hidden');
    //       }
    //     }
    //   }
    // });

    // this.model.addEventListener(WEBRTC_EVENTS.WEBRTC_SOME_VIDEO_STARTED, (e) => {
    //   if (e.data.userScreenShareOn) {
    //     return;
    //   }
    //   // console.log('WEBRTC_SOME_VIDEO_STARTED',e.data);
    //   const { userId, userVideoOn, streamId } = e.data;
    //   if (this.userId !== null) {
    //     if (userId === this.userId) {
    //       // let video = document.getElementById(`remoteVideo_${this.userId}`).getElementsByTagName('video')[0];
    //       // console.log('WEBRTC_SOME_VIDEO_STARTED viiiideo',video);
    //       // this.startVideo(video, userVideoOn);
    //       this.startVideo(document.getElementById(`remoteVideo${streamId}`), userVideoOn);
    //       //TODO
    //       //userVideoOn ? $(`#video_${userId}`).parent().removeClass('hidden') : $(`#video_${userId}`).parent().addClass('hidden');
    //       // console.log('userVideoOn: ',userVideoOn);
    //       // console.log($(`#video_${userId}`));
    //       //this.startVideo(document.getElementById(`video_${userId}`), userVideoOn);
    //       userVideoOn ? $(`#video_${userId}`).removeClass('hidden') : $(`#video_${userId}`).addClass('hidden');
    //       //userVideoOn ? $(`#video_${userId}`).parent().removeClass('hidden') : $(`#video_${userId}`).parent().addClass('hidden');
    //     }
    //   }
    // });

    // this.model.addEventListener(WEBRTC_EVENTS.WEBRTC_SOME_VIDEO_STOPPED, (e) => {
    //   if (this.userId !== null) {
    //     console.log('WEBRTC_SOME_VIDEO_STOPPED', this.userId);
    //     if (e.data.userId === this.userId) {
    //       this.mesh.material = this.material;
    //     }
    //   }
    // });

    // this.model.addEventListener(SCENE_INTERACTION.USER_AVATAR_CHANGED, (e) => {
    //   if (this.iSitOnIt) {
    //     textureLoader.load(e.data.userAvatarUrl, (newTex) => {
    //       this.material.map = newTex;
    //     });
    //   }
    // });

    // this.model.addEventListener(SCENE_INTERACTION.SOCKET_USER_INFO_CHANGED, (e) => {
    //   // userName and userAvatarUrl
    //   if (!this.iSitOnIt) {
    //     if (this.userId === e.data.userId) {
    //       this.userData.userName = e.data.userName;
    //       if (this.userData.userAvatarUrl !== e.data.userAvatarUrl) {
    //         this.userData.userAvatarUrl = e.data.userAvatarUrl;
    //         textureLoader.load(e.data.userAvatarUrl, (newTex) => {
    //           this.material.map = newTex;
    //         });
    //       }
    //     }
    //   }
    // });

    // this.model.addEventListener(SCENE_EVENTS.SOMEONE_SPOKE, (e) => {
    //   if (this.model.iSitOnThisVRChair === null) {
    //     if (this.userId !== null) {
    //       if (e.data[this.userId]) {
    //         const audioLevels = e.data[this.userId].audioLevels;
    //         if (audioLevels) {
    //           const amplitude = parseFloat(`1.${audioLevels / 20}`);
    //           this.requestFakeAnimation = true;
    //           this.fakeAudioLevelsAnimation(amplitude);
    //         }
    //       }
    //     }
    //   } else {
    //     this.requestFakeAnimation = false;
    //   }
    // });

    // this.model.addEventListener(WEBRTC_EVENTS.WEBRTC_I_STOP_BROADCASTING, (e) => {
    //   console.log('WEBRTC_I_STOP_BROADCASTING', e.data);
    //   // self.standUp();
    // });
    // }
    return this;
  }

  fixRaportRatio(streamWidth, streamHeight) {
    if (this.videoElement !== null && this.videoElement !== undefined) {
      if (streamWidth && streamHeight) {
        this.videoMaterial.uniforms.ratio.value = streamWidth / streamHeight;
        this.videoMaterial.uniforms.isPortrait.value = streamWidth < streamHeight;
      } else {
        this.videoMaterial.uniforms.ratio.value = this.videoElement.videoWidth / this.videoElement.videoHeight;
        this.videoMaterial.uniforms.isPortrait.value = this.videoElement.videoWidth < this.videoElement.videoHeight;
      }
    }
  }

  setMyMood() {
    // const mood = document.querySelector("#user_mood").classList[0].replace("mood_", "");
    // this.showOrUpdateMood(mood);
  }

  updateUserVideoState(state) {
    // console.log('updateUserVideoState');
    if (this.videoElement !== null && this.videoElement !== undefined) {
      this.mesh.material = state ? this.videoMaterial : this.material;
      // state ? $(this.videoElement).parent().removeClass('hidden') : $(this.videoElement).parent().addClass('hidden');
    }
  }

  useAvatarMaterial = (texture) => {
    console.log('useAvatarMaterial');
    this.mesh.material = this.material;
    this.material.map = texture;
    this.isVideoTexture = false;
    this.setMyMood();
  }

  useVideoMaterial() {
    // if (this.startVideo(document.getElementById('localVideo'))) {
    //   this.isVideoTexture = true;
    // } else {
    //   this.model.alert('error', this.model.languageObject['error-turn-on-camera'].text);
    // }
    // this.setMyMood();
  }

  takeSeat(isVideoTextureOn = false, texture = null, videoId = 'localVideo') {
    // // console.log('takeSeat');
    // this.videoElement = videoId !== null ? document.getElementById(videoId) : null;
    // this.iSitOnIt = true;
    // this.emptySeat = false;

    // this.mesh.visible = true;
    // // $(`.indicator-${this.mesh.id}`).addClass('taken');

    // if (this.iSitOnIt) {
    //   if (texture !== null) {
    //     this.material.map = texture;
    //   }
    //   this.audioLevelsAnalyzer(this.videoElement.srcObject);
    //   isVideoTextureOn ? this.useVideoMaterial() : this.useAvatarMaterial(texture);

    // }
  }

  standUp() {
    // console.log('standUp');
    this.emptySeat = true;
    this.iSitOnIt = false;
    this.material.map = this.emptySeatTexture;
    this.mesh.material = this.material;
    this.userData = null;
    this.userInfo = null;
    this.userId = null;
    this.moodMesh.visible = false;
    // if(this.videoElement){
    //   //this.videoElement.srcObject = null;
    //   console.log('standUp videoElement.srcObject',this.videoElement.srcObject );
    // }
    this.videoElement = null;
    this.stopAudioLevelsAnalyzer();
    this.hideUserOptions();
    this.mesh.visible = false;
    // $(`.indicator-${this.mesh.id}`).removeClass('taken');
  }

  occupySeat(userData) {
    // this.userData = userData;
    // this.emptySeat = false;

    // if (userData !== undefined) {
    //   const activeVideoElementForThisUserExists = !!document.getElementById(`video_${userData.userId}`);
    //   this.showOrUpdateMood(userData.currentUserMood);

    //   this.mesh.visible = true;
    //   $(`.indicator-${this.mesh.id}`).addClass('taken');

    //   if (userData.webcamStreamId && (this.model.myWebcamStreamId || this.model.iShareScreen)) {
    //     // when a peer switch chair and his video camera is on
    //     const activeStreamVideo = !!document.getElementById(`remoteVideo${userData.webcamStreamId}`);
    //     if (activeStreamVideo) {
    //       // console.log('activeStreamVideo userData',userData);
    //       this.audioLevelsAnalyzer(document.getElementById(`remoteVideo${userData.webcamStreamId}`).srcObject);
    //       userData.userVideoOn ? this.startVideo(document.getElementById(`remoteVideo${userData.webcamStreamId}`)) : this.setAvatarImage(userData.userAvatarUrl);
    //       userData.userVideoOn ? $(`#remoteVideo${userData.webcamStreamId}`).parent().removeClass('hidden') : $(`#remoteVideo${userData.webcamStreamId}`).parent().addClass('hidden');
    //     } else {
    //       // console.log('! activeStreamVideo');
    //       this.setAvatarImage(userData.userAvatarUrl);
    //     }
    //   } else if (activeVideoElementForThisUserExists) {
    //     // when a peer switch chair and his video camera is on 1on1
    //     console.log('activeVideoElementForThisUserExists');
    //     this.audioLevelsAnalyzer(document.getElementById(`video_${userData.userId}`).srcObject);
    //     userData.userVideoOn && this.setAvatarImage(userData.userAvatarUrl, false);
    //     userData.userVideoOn ? this.startVideo(document.getElementById(`video_${userData.userId}`)) : this.setAvatarImage(userData.userAvatarUrl);
    //     userData.userVideoOn ? $(`#video_${userData.userId}`).parent().removeClass('hidden') : $(`#video_${userData.userId}`).parent().addClass('hidden');
    //   } else if (this.isPublic && this.model.guestJoinedPublicStage) {
    //     console.log('ocupy seat for public stage!!!');
    //     //public video
    //     console.log('userData', userData);
    //     // console.log('e.data[this.userId]',e.data[this.userId]);
    //     console.log('this.model.guestJoinedPublicStage', this.model.guestJoinedPublicStage);
    //     this.createPublicVideoElement(userData);
    //   } else {
    //     // console.log('!activeVideoElementForThisUserExists',userData);
    //     this.setAvatarImage(userData.userAvatarUrl);
    //   }

    // }
  }

  setBusyTexture(on1on1Call) {
    if (on1on1Call) {
      console.log('setBusyTexture', on1on1Call);
    }
    this.busyMesh.visible = on1on1Call;
  }

  setAvatarImage(url, apply = true) {

    // console.log('setAvatarImage');

    // fetch(url, { method: 'HEAD' })
    //   .then(res => {
    //     if (res.ok) {
    //       //console.log('Image exists.');
    //       const tex = textureLoader.load(url);
    //       this.material.map = tex;
    //       if (apply) {
    //         this.mesh.material = this.material;
    //       }
    //     } else {
    //       // console.log('Image does not exist.');
    //       //when from app.bagless.io or CORS problem
    //       this.material.map = defaultTexture;
    //       if (apply) {
    //         this.mesh.material = this.material;
    //       }
    //     }
    //   }).catch(err => console.log('Error:', err));
  }

  startVideo(videoElement, userVideoOn = true, streamId, streamWidth, streamHeight) {
    // // console.log('startVideo',videoElement);
    // if (!videoElement.srcObject) { return }
    // const isStream = videoElement.srcObject !== null;
    // let videoEnabled = true;
    // // console.log('isStream',isStream);
    // if (isStream) {
    //   videoEnabled = videoElement.srcObject.getVideoTracks()[0].enabled; //TODO
    //   if (videoEnabled) {
    //     this.videoElement = videoElement;
    //     if (streamWidth != 0 && streamHeight != 0) {
    //       this.fixRaportRatio(streamWidth, streamHeight);
    //     } else {
    //       this.fixRaportRatio();
    //     }
    //     this.videoMaterial.uniforms.tex.value = new VideoTexture(this.videoElement);
    //     this.mesh.material = userVideoOn ? this.videoMaterial : this.material;
    //   } else {
    //     this.mesh.material = this.material;
    //   }

    //   this.audioLevelsAnalyzer(videoElement.srcObject);
    // }

    // return isStream;
  }

  isEmpty() {
    return this.emptySeat;
  }

  isMine() {
    return this.iSitOnIt;
  }

  audioLevelsAnalyzer = (stream) => {
    if (this.requestAudioLevels || !stream) {
      return
    }
    const audioContext = new AudioContext();
    const audioSource = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.4;
    audioSource.connect(analyser);
    const volumes = new Uint8Array(analyser.frequencyBinCount);

    this.requestAudioLevels = true;
    let firstSend = true;

    const levelsLoop = () => {
      setTimeout(() => {

        analyser.getByteFrequencyData(volumes);
        let volumeSum = 0;
        for (const volume of volumes) {
          volumeSum += volume;
        }
        this.averageVolume = Math.round(volumeSum / volumes.length);
        const scaleAmplitude = parseFloat(`1.${this.averageVolume / 20}`);
        this.moodMesh.scale.set(scaleAmplitude, scaleAmplitude, 1);

        if (firstSend) {
          this.iSitOnIt && this.model.dispatchEvent({ type: WEBRTC_EVENTS.WEBRTC_USER_IS_SPEAKING, data: { audioLevels: this.averageVolume } });
          firstSend = false;
        }

        this.requestAudioLevels && levelsLoop();

      }, 100);
    }
    levelsLoop();

    const updateLevelsOnServerLoop = () => {
      setTimeout(() => {
        this.model.dispatchEvent({ type: WEBRTC_EVENTS.WEBRTC_USER_IS_SPEAKING, data: { audioLevels: this.averageVolume } });

        this.requestAudioLevels && updateLevelsOnServerLoop();

      }, 1000);
    }
    this.iSitOnIt && updateLevelsOnServerLoop();
  }

  stopAudioLevelsAnalyzer() {
    this.requestAudioLevels = false;
    this.averageVolume = 0;
    this.moodMesh.scale.set(1, 1, 1);
  }

  fakeAudioLevelsAnimation(amplitude) {
    // gsap.to(this.moodMesh.scale, {
    //   duration: .5,
    //   x: amplitude,
    //   y: amplitude,
    //   ease: RoughEase.ease.config({ strength: 8, points: 5, template: Linear.easeNone, randomize: false }),
    //   onComplete: () => {
    //     gsap.to(this.moodMesh.scale, {
    //       duration: .25,
    //       x: 1,
    //       y: 1
    //     });
    //   }
    // });
  }

  showUserOptions() {
    // $(".cta-menu").removeClass("is-active");

    // if (this.iSitOnIt) {
    //   $("#own-chair-menu").addClass("is-active");
    // } else {
    //   $("#peer-chair-menu").addClass("is-active");
    // }
    // $("#peerIsFriend").hide();
    // $("#peerAddAsFriend").hide();
    // if (this.model.config.userId === this.userId) {
    //   return
    // }
    // if (this.userId && !this.model.friendsMap[this.userId]) {
    //   $("#peerIsFriend").hide();
    //   $("#peerAddAsFriend").show();
    // } else {
    //   $("#peerIsFriend").show();
    //   $("#peerAddAsFriend").hide();
    // }
  }

  hideUserOptions() {
    // super.hideUserOptions();
    // $("#own-chair-menu").removeClass("is-active");
    // $("#peer-chair-menu").removeClass("is-active");
  }

  showInfo() {

    // if (!this.userInfo)
    //   return;

    // this.model.showUserInfo({ data: { ...this.userInfo, wpId: this.userInfo.hasProfile }, eventOrigin: '3Dobject' });
    // this.hideUserOptions();
  }

  addAsFriend() {
    // this.model.worldFetcher.addAsFriend(this.userId, (response) => {
    //   this.model.onFriendAddedSuccess(response);
    // });
  }

  createPublicVideoElement(userData) {

    // let streamId = userData.webcamStreamId;
    // if (!streamId) {
    //   console.log('no stream id!');
    //   return;
    // }
    // let displayName = userData.userName;
    // if ($(`#remoteVideo${streamId}`).length > 0) {
    //   // console.log('createPublicVideo Element return it exists!', displayName, streamId);
    //   // console.log('userData', userData);
    //   // this.occupySeat(userData);
    //   userData.userVideoOn ? this.startVideo(document.getElementById(`remoteVideo${streamId}`)) : this.setAvatarImage(userData.userAvatarUrl);
    //   return;
    // }
    // console.log('%c getRemoteVideoFromMedia Server', 'background: pink; font-size:1em');
    // // let videoUrl = 'https://bagless-media-server.com:5443/WebRTCAppEE/play.html?name='+streamId;
    // let userId = userData.userId;
    // let avatar = userData.userAvatarUrl;
    // let userVideoOn = userData.userVideoOn;
    // let userScreenShareOn = userData.userScreenShareOn;

    // console.log('_create video for ', displayName);
    // var vidContainer = document.createElement('div');
    // vidContainer.setAttribute('id', 'remoteVideo_' + userId);
    // if (!userVideoOn) {
    //   vidContainer.setAttribute('class', 'video-wrapper hidden');
    // } else {
    //   vidContainer.setAttribute('class', 'video-wrapper');
    // }

    // var videoElement = document.createElement('video');
    // let videoId = `remoteVideo${streamId}`;
    // videoElement.setAttribute('autoplay', true);
    // videoElement.setAttribute('playsinline', true);
    // videoElement.setAttribute('id', videoId);

    // vidContainer.appendChild(videoElement);

    // let peerImg = document.createElement('img');
    // peerImg.setAttribute('src', avatar);
    // peerImg.setAttribute('class', `avatar-img ${userId}`);
    // vidContainer.appendChild(peerImg);

    // const icon = document.createElement('span');
    // icon.textContent = 'phone_in_talk';
    // icon.setAttribute('class', 'material-icons-outlined on-call-icon');
    // vidContainer.appendChild(icon);
    // // vidContainer.appendChild(this._generateLabelElement(displayName, userId));
    // $('#localVideoContainer').append(vidContainer);

    // this.videoElement = document.getElementById(`remoteVideo${userData.webcamStreamId}`);
    // console.log('userData', userData);
    // let unique_id = this.unique_id;
    // // console.log('this.videoElement',this.videoElement);

    // this.model.dispatchEvent({ type: WEBRTC_EVENTS.GET_PUBLIC_STREAM, data: { streamId, videoId, userId, userVideoOn, userScreenShareOn, unique_id } });
    // this.occupySeat(userData);

  }

}

export { VRChairObject };