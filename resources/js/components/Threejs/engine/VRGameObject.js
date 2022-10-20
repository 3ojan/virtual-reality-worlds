import { VRObject3D } from './VRObject3D';
import { GAME_EVENTS } from '../../constants/game.js';
import { SOCKET_EVENTS } from '../../socket/Socket.js';
import { WEBRTC_EVENTS } from '../../constants/webrtc';
import { SCENE_EVENTS } from '../MVC/Model';

export default class VRGameObject extends VRObject3D {
  
    constructor(containerName, model) {
  
        super(containerName);
        this.model = model;
        this.activeGame = false;
        this.visitorsBlinkTimer = null;
        this.minimized = false;
        this.iAmPlayer = false;

        this.socket = this.model.socket;
        this.userProperties = this.model.editMode ? {} : this.model.getUserData();

        this.players = {};
        this.visitors = {};

        !this.model.editMode && this.eventsHandler();
        
        return this; 
    }

    eventsHandler = () => {

        if(this.socket){

            this.socket.addEventListener(SOCKET_EVENTS.USER_DATA_CHANGED, ()=>{
                this.userProperties = this.socket.getUserData();
            });

            this.socket.addEventListener(SOCKET_EVENTS.SOCKET_READY, () => {
                this.send({
                    eventName: GAME_EVENTS.GET_INITIAL_GAME_DATA,
                    userId: this.userProperties.userId,
                    gameId: this.dbConfig.id,
                    gameData: this.gameData
                });
            });

            this.socket.addEventListener(SOCKET_EVENTS.GAMING_DATA, (e) => {
                const payload = e.data;
                if(payload.gameId === this.dbConfig.id){
                    switch(payload.eventName){

                        case GAME_EVENTS.GET_INITIAL_GAME_DATA: this.getInitialGameDataHandler(payload);
                            break;

                        case GAME_EVENTS.NEW_VISITOR: this.newVisitorHandler(payload);
                            break;

                        case GAME_EVENTS.NEW_PLAYER: this.newPlayerHandler(payload);
                            break;

                        case GAME_EVENTS.GAME_DATA_CHANGED: this.updateGameDataHandler(payload);
                            break;

                        case GAME_EVENTS.GAME_START: this.gameStartHandler(payload);
                            break;

                        case GAME_EVENTS.VISITOR_OR_PLAYER_LEFT: this.visitorPlayerLeftHandler(payload);
                            break;

                        case GAME_EVENTS.RESTART_GAME: this.restartGameHandler(payload);
                            break;

                        default: return;
                    }
                }
            });
        }
    }

    send = (payload) =>{
        this.socket !== null && this.socket.getSocket().emit('gaming', payload);
    }

    initiateVideoCall = (userId) =>{
        this.model.dispatchEvent({ type: WEBRTC_EVENTS.WEBRTC_VIDEO_ONE_ON_ONE, data: { item: this.peerData(userId) } });
    }
    
    initiateChat = (userId) =>{
        this.model.dispatchEvent({ type: SCENE_EVENTS.ONE_ON_ONE_CHAT, item: this.peerData(userId) });
    }

    peerData = (userId) =>{
        const participants = { ...this.visitors, ...this.players };

        if(isNaN(userId)){
            if(userId.includes('player')){
                userId = this[userId].profile.userId;
                return participants[userId].profile;
            }
        }

        return participants[userId];
    }
}