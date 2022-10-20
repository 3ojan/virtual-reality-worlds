// WebSocket.js

import React, { createContext } from 'react'
import io from 'socket.io-client';
import { SOCKET_LOCAL_CONFIG } from './config';
import { useDispatch } from 'react-redux';
import { setCurrentUsers } from '../../redux/chat/socketRedux'
import { onLoadPrivateHistory, onLoadWorldHistory, onSceneMessage, onLoadSceneHistory, onPrivateMessage, onWorldMessage } from '../../redux/chat/chat'
// import { updateChatLog } from './actions';
import { stringToHslColor } from '../../helpers/color';

const WebSocketContext = createContext(null)

export { WebSocketContext }

export default ({ children }) => {
  let socket;
  let ws;
  const userProperties = {
    userId: 1,
    userName: "Test",
    userAvatarUrl: "...",
  }

  const dispatch = useDispatch();

  const sendMessage = (roomId, message) => {
    const payload = {
      roomId: roomId,
      data: message
    }
    socket.emit("event://send-message", JSON.stringify(payload));
  }
  const send = (payload) => {
    socket.emit('message', payload);
  }

  const sendMessageNotification = (message) => {
    send({
      eventName: 'userLockingRoom',
      userId: userProperties.userId,
      text: message
    });
  }
  const requestFriendsInfo = (friendsIds) => {
    send({
      eventName: 'getUsersInfo',
      userIds: friendsIds,
      senderId: userProperties.userId,
    });
    // this.dispatchEvent({ type: SOCKET_EVENTS.FRIENDS_LIST_LOADED });
  }
  const sendGlobalInvite = (receiverId, invite = false) => {
    send({
      eventName: 'sendGlobalInvite',
      invite,
      senderId: userProperties.userId,
      receiverId,
    });
    // this.dispatchEvent({ type: SOCKET_EVENTS.FRIENDS_LIST_LOADED });
  }
  const onSendPrivateRequest = ({ message, userName, userId, wantedSceneId }) => {
    if (!message) {
      return;
    }
    const messagePayload = {
      eventName: 'chatMessage',
      text: message,
      wantedSceneId: wantedSceneId,
      senderId: userProperties.userId,
      senderName: userProperties.userName,
      senderAvatarUrl: userProperties.userAvatarUrl,
      receiverId: userId,
      receiverName: userName,
      receiverType: 'lockRequest', ///TODO :: Add constants
      time: new Date().getTime(),
    };
    if (socket) {
      socket.emit('message', messagePayload);
    }
  }
  const onAcceptPrivateRequest = ({ message, userName, userId, approve }) => {
    const messagePayload = {
      eventName: 'chatMessage',
      text: message,
      senderId: userProperties.userId,
      senderName: userProperties.userName,
      senderAvatarUrl: userProperties.userAvatarUrl,
      receiverId: userId,
      receiverName: userName,
      wantedSceneId: userProperties.sceneId,
      approve: approve,
      receiverType: 'acceptLockRequest', ///TODO :: Add constants
      time: new Date().getTime(),
    };
    if (socket) {
      socket.emit('message', messagePayload);
    }
  }

  const updateUserData = (newUserData) => {
    send({
      eventName: 'updateUserData',
      senderId: userProperties.userId,
      data: newUserData,
    });
  }


  const joinScene = (sceneId, sceneName) => {
    send({
      eventName: 'sceneJoined',
      senderId: userProperties.userId,
      data: {
        sceneId: sceneId,
        sceneName: sceneName,
      },
    });

  }
  const userChangingSeat = (userId, newSeatId, streamId) => {
    userId = userId || userProperties.userId;
    send({
      eventName: 'userChangingSeat',
      userId: userId,
      seatId: newSeatId,
      streamId: streamId,
    });
  };
  const userChangingScreen = (userId, newScreenId, screenStreamId) => {
    userId = userId || userProperties.userId;
    console.log('_userChangingScreen', userId, newScreenId, screenStreamId); //TODO when stopped
    send({
      eventName: 'userChangingScreen',
      userId: userId,
      screenId: newScreenId,
      streamId: screenStreamId
    });
  };
  const userLockingRoom = (userId, newSceneId) => {
    userId = userId || userProperties.userId;
    send({
      eventName: 'userLockingRoom',
      userId: userId,
      sceneId: newSceneId,
    });
  };
  const inviteUserToRoom = (receiverId, wantedSceneId) => {
    send({
      eventName: 'startRoomInvitation',
      wantedSceneId,
      receiverId,
      senderId: userProperties.userId,
    });
  };

  const requestChatHistory = (senderId) => {
    console.log("Getting history messages between::")
    console.log(userProperties.userName)
    console.log("AND")
    if (this._currentUserData[senderId]) {
      console.log(this._currentUserData[senderId])
      console.log(this._currentUserData[senderId].userName)
    }
    send({
      eventName: 'requestChatHistory',
      senderId: senderId,
      userId: userProperties.userId,
    });
  }
  const onSendOfflinePvt = ({ message, userName, userId }) => {
    if (!message) {
      return;
    }
    const messagePayload = {
      eventName: 'chatOfflineMessage',
      text: message,
      senderId: userProperties.userId,
      senderName: userProperties.userName,
      senderAvatarUrl: userProperties.userAvatarUrl,
      receiverId: userId,
      sceneId: this.model.currentScene.id,
      receiverName: userName,
      sceneId: this.model.currentScene.id,
      receiverType: 'user',
      time: new Date().getTime(),
    };
    if (socket) {
      socket.emit('message', messagePayload);
    }
  }
  const onSendMessagePvt = ({ message, userName, userId }) => {
    if (!message) {
      return;
    }
    const messagePayload = {
      eventName: 'chatMessage',
      text: message,
      senderId: userProperties.userId,
      senderName: userProperties.userName,
      senderAvatarUrl: userProperties.userAvatarUrl,
      receiverId: userId,
      sceneId: this.model.currentScene.id,
      receiverName: userName,
      sceneId: this.model.currentScene.id,
      receiverType: 'user',
      time: new Date().getTime(),
    };
    if (socket) {
      socket.emit('message', messagePayload);
    }
  }
  const onSendMessage = (message, receiverId, type) => {
    if (!message) {
      return;
    }
    const messagePayload = {
      eventName: 'chatMessage',
      text: message,
      senderId: userProperties.userId,
      senderName: userProperties.userName,
      senderAvatarUrl: userProperties.userAvatarUrl,
      receiverId,
      sceneId: SOCKET_LOCAL_CONFIG["currentSceneId"],
      receiverName: userProperties.userName,
      receiverType: type ? type : 'room',
      time: new Date().getTime(),
    };
    if (socket) {
      socket.emit('message', messagePayload);
    }
  }

  if (!socket) {
    socket = io.connect(SOCKET_LOCAL_CONFIG['socketUrl'], {
      transports: ['websocket', 'polling'],
      query: SOCKET_LOCAL_CONFIG,
    })

    socket.on('connect', () => {
      setInterval(() => {
        onSendMessage(Math.random(), 111, "room")
      }, 6000)
      console.log('connect', socket.id);
      // this.model.dispatchEvent({ type: SOCKET_EVENTS.SOCKET_CONNECT_SUCCESS });
      // this.initialised = true;
      // autoGenerateUsersList(this.model, this);
    });

    socket.on('disconnect', (reason) => {
      console.log('disconnect', reason);
      if (reason === 'io server disconnect') { // the disconnection was initiated by the server, you need to reconnect manually
        setTimeout(() => {
          socket.connect();
        }, 2000);
      }
    });

    socket.on('message', (payload) => {

      // this._handleMessage(payload);
      // console.log('message', payload);
      const data = payload;
      console.log(payload)
      console.log(`%c ${payload.eventName} `, `color:${stringToHslColor(payload.eventName, 100, 70)}; background: black; font-weight:bold`);
      if (payload.eventName === "chatMessage") {
        if (payload.receiverType === "room") {
          dispatch(onWorldMessage(payload));
        }
        if (payload.receiverType === "user") {
          dispatch(onPrivateMessage(payload));
        }
        if (payload.receiverType === "local") {
          dispatch(onSceneMessage(payload));
        }
        if (payload.receiverType === "lockRequest") {
          // this.model.lockRequestUser = data;
          // this.model.dispatchEvent({ type: SOCKET_EVENTS.REQUEST_RECIEVED, data });
        }
        if (payload.receiverType === "acceptLockRequest") {
          // this.model.dispatchEvent({ type: SOCKET_EVENTS.REQUEST_ACCEPTED, data });
        }
      }
      try {
        switch (payload.eventName) {
          case 'currentUsers':
            dispatch(setCurrentUsers(payload.data));
            // console.log('currentUsers', payload)
            // this._currentUserData = payload.data || {};
            // for (let [key, value] of Object.entries(this._currentUserData)) {
            //   if (value.userScreenShareOn) {
            //     var obj = {};
            //     obj[value.objId] = value.userId;
            //     this._currentUserData.occupiedScreens = obj;
            //   }
            // }

            //// HERE create inital lockedRooms on user connects and connect with VRScebeChangeObject

            //Object.assign(obj, {})
            // if (this._currentUserData.occupiedScreens) {
            //   console.log('this._currentUserData.occupiedScreens', this._currentUserData.occupiedScreens);
            // }
            // this.model.onSceneInitialised(payload, this._currentUserData);
            // this.dispatchEvent({ type: SOCKET_EVENTS.USER_DATA_CHANGED, data: this._currentUserData });
            // if (this._currentUserData.occupiedSeats) {
            //   let data = payload.data;
            //   delete data.occupiedSeats;
            // }
            break;
          case 'chatMessage':
            // $j('body').trigger('aptis-uiChatMessageReceived', [payload]);
            console.log("chatMessage", payload)
            break;
          case 'sessionConnected':
            // // console.log("sessionConnected", payload)
            // this._currentUserData[payload.data.userId] = payload.data;
            // this.dispatchEvent({ type: SOCKET_EVENTS.USER_DATA_CHANGED, data: this._currentUserData });
            // this.model.dispatchEvent({ type: SCENE_EVENTS.SOMEONE_JOINED_ROOM, data: payload.data });
            // // $j('body').trigger('aptis-user-connected', [payload.data || {}]);
            break;
          case 'sessionDisconnected':
            // this.dispatchEvent({ type: SOCKET_EVENTS.USER_DISCONNECTED, data: this._currentUserData[payload.data.userId] || payload.data || {} });
            // this.model.dispatchEvent({ type: SCENE_EVENTS.SOMEONE_LEAVED_ROOM, data: this._currentUserData[payload.data.userId] });

            // if (this._currentUserData[payload.data.userId]) {
            //   this._currentUserData[payload.data.userId].userScreenShareOn = payload.data.userScreenShareOn ? payload.data.userScreenShareOn : false;
            //   this._currentUserData[payload.data.userId].objId = payload.data.objId ? payload.data.objId : null;
            //   if (!payload.data.userScreenShareOn) {
            //     for (const key in this._currentUserData.occupiedScreens) {
            //       if (this._currentUserData.occupiedScreens[key] == payload.senderId) {
            //         this._currentUserData.occupiedScreens[key] = null;
            //       }
            //     }
            //   }
            // }
            // if (this._currentUserData[payload.data.userId]) {
            //   delete this._currentUserData[payload.data.userId];
            // }
            // this.dispatchEvent({ type: SOCKET_EVENTS.USER_DATA_CHANGED, data: this._currentUserData });
            // console.log("sessionDisconnected", this._currentUserData);
            break;
          case 'sceneJoined':
            // this.dispatchEvent({ type: SOCKET_EVENTS.USER_LEFT_SCENE, payload });
            // if (this._currentUserData[payload.senderId]) {
            //   this._currentUserData[payload.senderId].currentSceneId = payload.data.sceneId || '';
            //   this._currentUserData[payload.senderId].currentSceneName = payload.data.sceneName || '';
            //   this.dispatchEvent({ type: SOCKET_EVENTS.USER_JOINED_SCENE, data: payload });
            //   this.dispatchEvent({ type: SOCKET_EVENTS.USER_DATA_CHANGED, data: this._currentUserData });
            //   //   $j('body').trigger('aptis-user-joined-scene', [payload.senderId, payload.data.sceneId, payload.data.sceneName]);
            // }
            break;

          case 'sessionConnected_global':
            // console.log(payload);
            // const { userId, isGuest } = model.config;
            // if (userId && !isGuest) {
            //   initGravitec(userId, this.model)
            // }
            // this.model.dispatchEvent({ type: GLOBAL_EVENTS.SESSION_CONNECTED, data: payload.data });
            break;

          case 'userMoodChanged':
            // if (this._currentUserData[payload.senderId]) {
            //   this._currentUserData[payload.senderId].currentUserMood = payload.data.newMood ? payload.data.newMood.toString() : 1;
            // }
            // this.dispatchEvent({ type: SOCKET_EVENTS.USER_DATA_CHANGED, data: this._currentUserData });
            // this.model.dispatchEvent({ type: SCENE_EVENTS.SOMEONE_CHANGED_DATA, data: this._currentUserData });
            break;

          case 'userMoodChanged_global':
            // this.model.dispatchEvent({ type: GLOBAL_EVENTS.MOOD_CHANGED, data: payload });
            break;

          case 'userVideoStateChanged':
            // // console.log('userVideoStateChanged',payload);
            // if (this._currentUserData[payload.senderId]) {
            //   this._currentUserData[payload.senderId].userVideoOn = payload.data.userVideoOn ? payload.data.userVideoOn : false;
            //   this._currentUserData[payload.senderId].on1on1Call = payload.data.on1on1Call ? payload.data.on1on1Call : false;
            // }
            // this.dispatchEvent({ type: SOCKET_EVENTS.USER_DATA_CHANGED, data: this._currentUserData });
            // this.model.dispatchEvent({ type: SCENE_EVENTS.SOMEONE_CHANGED_DATA, data: this._currentUserData });
            // $(".localVideoWrapper").hasClass('focus-mode') && $("#active-focused-element").val() === `video_${payload.senderId}` && $(".focused_element").toggleClass('hidden', !payload.data.userVideoOn);
            // $(`#remoteVideo_${payload.senderId}`).toggleClass('on-1on1-call', payload.data.on1on1Call);
            break;

          case 'userScreenShareStateChanged':
            // console.log('userScreenShareState Changed payload', payload);
            // if (this._currentUserData[payload.senderId]) {
            //   this._currentUserData[payload.senderId].userScreenShareOn = payload.data.userScreenShareOn ? payload.data.userScreenShareOn : false;
            //   this._currentUserData[payload.senderId].objId = payload.data.objId ? payload.data.objId : null;
            //   // console.log('this._currentUserData.occupiedScreens ', this._currentUserData.occupiedScreens);

            //   if (!payload.data.userScreenShareOn) {
            //     for (const key in this._currentUserData.occupiedScreens) {
            //       // console.log(this._currentUserData.occupiedScreens);
            //       // console.log(this._currentUserData.occupiedScreens[key]);
            //       // console.log(payload.senderId);
            //       if (this._currentUserData.occupiedScreens[key] == payload.senderId) {
            //         this._currentUserData.occupiedScreens[key] = null;
            //       }
            //     }
            //   }

            // }
            // this.dispatchEvent({ type: SOCKET_EVENTS.USER_DATA_CHANGED, data: this._currentUserData });
            // this.model.dispatchEvent({ type: SCENE_EVENTS.SOMEONE_CHANGED_DATA, data: this._currentUserData });
            break;

          case 'userChangedScreen':
            // if (payload.data) {
            //   console.log('userChangedScreen payload', payload);
            //   //console.log('this._currentUserData[payload.senderId]', this._currentUserData[payload.senderId]);
            //   if (this._currentUserData[payload.senderId]) {
            //     this._currentUserData[payload.senderId].userScreenShareOn = payload.data.userScreenShareOn ? payload.data.userScreenShareOn : false;
            //     this._currentUserData[payload.senderId].objId = payload.data.objId ? payload.data.objId : null;
            //     // console.log('this._currentUserData[payload.senderId]', this._currentUserData[payload.senderId]);
            //   }
            //   if (payload.data.userScreenShareOn && payload.data.objId && payload.senderId) {
            //     let senderId = payload.senderId;
            //     let objId = payload.data.objId;
            //     var obj = {};
            //     obj[objId] = senderId;
            //     this._currentUserData.occupiedScreens = obj;
            //     // console.log('this._currentUserData[payload.senderId]', this._currentUserData[payload.senderId]);
            //   }
            // }
            // this.model.setOccupiedScreen(payload, this._currentUserData);
            // // console.log('this._currentUserData.occupiedScreens', this._currentUserData.occupiedScreens);
            // this.dispatchEvent({ type: SOCKET_EVENTS.USER_DATA_CHANGED, data: this._currentUserData });
            break;

          case 'userAudioLevelsChanged':
            // if (this._currentUserData[payload.senderId]) {
            //   this._currentUserData[payload.senderId].audioLevels = payload.data.newAudioLevels ? payload.data.newAudioLevels : 0;
            // }
            // this.model.dispatchEvent({ type: SCENE_EVENTS.SOMEONE_SPOKE, data: this._currentUserData });
            break;

          case 'request_shareScreen':
            // console.log('request_shareScreen', payload);
            // if (payload.data.userId == this.model.config.userId) {
            //   new ScreenShareRequestNotification({ data: payload.data, senderInfo: payload.senderInfo, requestToShareScreenText: this.model.languageObject['requests-to-share-screen-text'].text });
            // }
            break;

          case 'approved_shareScreen':
            // if (payload.data.callInitiatorID === userProperties.userId) { // not needed, let as double check
            //   this.model.dispatchEvent({ type: WEBRTC_EVENTS.YOUR_SCREEN_APPROVED, data: payload.data });
            // }
            break;

          case 'denied_shareScreen':
            // if (payload.data.callInitiatorID === userProperties.userId) { // not needed, let as double check
            //   this.model.dispatchEvent({ type: WEBRTC_EVENTS.YOUR_SCREEN_DENIED, data: payload.data });
            // }
            break;

          case 'videoOneOnOne_request':
            // if (payload.data.peerInfo.userId === userProperties.userId) { // not needed, let as double check
            //   new IncomingCallNotification({ data: payload.data, senderInfo: payload.senderInfo, isCallingYouText: this.model.languageObject['is-calling-you-text'].text });
            // }
            break;

          case 'videoOneOnOne_reject':
            // if (payload.data.callInitiatorID === userProperties.userId) { // not needed, let as double check
            //   this.model.dispatchEvent({ type: WEBRTC_EVENTS.WEBRTC_SOMEONE_REJECTED_YOUR_CALL, data: payload.data });
            // }
            break;

          case 'videoOneOnOne_cancel':
            // this._removeNotification(payload.data.classToBeRemoved);
            break;

          case 'checkOwnerStatus':
            // this.model.dispatchEvent({ type: GLOBAL_EVENTS.OWNER_STATUS, data: payload.data });
            break;

          case 'userAvatarChanged':
            // if (payload.data && payload.data.userId && payload.data.userAvatarUrl) {
            //   this._currentUserData[payload.data.userId].userAvatarUrl = payload.data.userAvatarUrl;
            // }
            // this.model.dispatchEvent({ type: GLOBAL_EVENTS.AVATAR_CHANGED, data: payload });
            break;

          case 'possibleCallInitiatorOrReceiverGotDisconnected':
            // const classToBeRemoved = `video_notification_from_${payload.senderId}`;
            // this._removeNotification(classToBeRemoved);
            // this.model.dispatchEvent({ type: GLOBAL_EVENTS.SESSION_DISCONNECTED, id: payload.senderId });
            break;

          case 'userDataUpdated': // userName - userAvatarUrl
            // if (this._currentUserData[payload.senderId]) {
            //   this._currentUserData[payload.senderId] = payload.data;
            //   this.model.onSocketUserDataChanged(payload.data);
            // }
            break;

          case 'userJoinGame':
            this.model.dispatchEvent({ type: GAME_EVENTS.NEW_VISITOR, data: payload });
            break;

          case 'updateGameUserStatus':
            this.model.dispatchEvent({ type: GAME_EVENTS.NEW_PLAYER_RECEIVED, data: payload });
            break;

          case 'updateGameStatus':
            this.model.dispatchEvent({ type: GAME_EVENTS.GAME_START, data: payload });
            break;

          case 'userLeftGame':
            this.model.dispatchEvent({ type: GAME_EVENTS.VISITOR_PLAYER_LEFT, data: payload });
            break;

          case 'environmentChanged':
            // console.log('environment changed', payload)
            if (payload.senderId != userProperties.userId) {
              this.model.worldID == payload.roomId && this.model.confirm(this.model.languageObject['confirm-room-data-changed'].text, () => { window.location.reload() });
            }
            break;

          case 'userChangedSeat':
            // console.log('userChangedSeat', payload);
            // console.log('_currentUserData: ', this._currentUserData);
            // console.log('currentUserMood ', this._currentUserData[payload.userId].currentUserMood);
            // if (this._currentUserData.occupiedSeats) {
            // this._currentUserData.occupiedSeats = payload.occupiedSeats;
            // console.log('_currentUserData: ', this._currentUserData);
            // }
            // this.model.setOccupiedSeat(payload, this._currentUserData);
            // this.dispatchEvent({ type: SOCKET_EVENTS.USER_DATA_CHANGED, data: this._currentUserData });
            // $j('body').trigger('aptis-user-changed-seat', [payload]);
            break;

          case 'userLockRoom':
            // console.log('userLockRoom: ', this._currentUserData);
            // if (payload.lockedRooms) {
            //   this._currentUserData.lockedRooms = payload.lockedRooms;
            // }
            // this.model.setLockedRooms(payload, this._currentUserData);
            break;
          case 'startRoomInvitation':
            // this.model.onSendUserJoinRoomInvitation(payload);
            break;
          case 'userChangedShowWebrtcInSeat':
            // $j('body').trigger('aptis-user-changed-show-webrtc-in-seat', [payload.userId, payload.seatId, payload.showInSeat]);
            break;
          case 'requestChatHistory':
            // this.dispatchEvent({ type: SOCKET_EVENTS.CHAT_HISTORY_LOADED, data: payload });
            break;
          case 'getUsersInfo':
            // this.onlineFriends = payload.users;
            // this.dispatchEvent({ type: SOCKET_EVENTS.ONLINE_FRIENDS_LOADED });
            break;
          case 'sendGlobalInvite':
            if (payload.invite) {
              ///redirect
              const callback = (payload) => {
                window.location = window.location.protocol + "//" + window.location.host + "/worlds/view?" + payload.url
              }
              // this.model.dispatchEvent({ type: SCENE_EVENTS.START_ANIMTAION_OUTRO, data: { onEndCallback: () => { callback(payload) } } })

            } else {
              // this.model.dispatchEvent({ type: SCENE_EVENTS.GLOBAL_USER_JOIN_WORLD_INVITATAION, payload })
              //invite sent
            }
            break;
          default:
            console.error("Unbekanntes Event", payload);
            break;
        }
      } catch (exception) {
        console.error('VRSocketManager._handleMessage()', exception, payload.eventName, payload);
      }
      // this.dispatchEvent({ type: SOCKET_EVENTS.DATA_RECIEVED, data });
    });

    ws = {
      socket: socket,
      sendMessage,
    }
  }

  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  )
}