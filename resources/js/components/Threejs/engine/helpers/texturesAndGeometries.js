import {
    CircleBufferGeometry,
    PlaneBufferGeometry,
    PlaneGeometry,
    TextureLoader,
    MeshBasicMaterial,
    DoubleSide,
} from 'three';

export const chairCircleGeometry = new CircleBufferGeometry(40, 64);

export const squareGeometry = new PlaneBufferGeometry(48, 48);

export const chairPlaneGeometry = new PlaneGeometry(96, 96);  //double borderCircleGeometry
export const moodCircleGeometry = new CircleBufferGeometry(44, 64);
export const borderCircleGeometry = new CircleBufferGeometry(48, 64);

export const textureToggleGeometry = new CircleBufferGeometry(10, 32);
export const btnGeometry = new CircleBufferGeometry(10, 32);

export const sceneChangeGeometry = squareGeometry;
export const youtubePlaneGeometry = new PlaneGeometry(480, 360);
export const menuPositionCircleGeometry = new CircleBufferGeometry(2, 8);

export const shareScreenGeometry = new PlaneGeometry(480, 360);
export const borderShareScreenGeometry = new PlaneGeometry(485, 362);

export const profileCircleGeometry = chairCircleGeometry;
export const linkGeometry = squareGeometry;
export const chessGeometry = new CircleBufferGeometry(24, 32);;

export const textureLoader = new TextureLoader();
export const green_mood = textureLoader.load('public/image/textures/greenMood.png'); // green_mood.png
export const yellow_mood = textureLoader.load('public/image/textures/yellowMood.png');
export const red_mood = textureLoader.load('public/image/textures/redMood.png');

export const defaultTexture = textureLoader.load('public/image/textures/defaultAvatar.png');
export const inTalkTexture = textureLoader.load('public/image/textures/inTalk.png');
export const emptySeatTexture = textureLoader.load('public/image/textures/emptySeat.png');
export const ai_avatar = textureLoader.load('public/image/textures/AI_avatar.png');

export const screenShareTexture = textureLoader.load('public/image/textures/icons/edit_screenShare.png'); // screenShareBG.png

export const lockedTexture = textureLoader.load('public/image/textures/locked.png');


export const delete_icon = textureLoader.load('public/image/textures/icons/ICON_Delete_Black.png');
export const settings_icon = textureLoader.load('public/image/textures/icons/ICON_Adjustment_Black.png');

export const linkTexture = textureLoader.load('public/image/textures/icons/edit_link.png');
export const chessTexture = textureLoader.load('public/image/textures/icons/edit_chess_game.png');
export const paypalDonateTexture = textureLoader.load('public/image/textures/icons/edit_donation.png');
export const emptyTexture = textureLoader.load('public/image/textures/empty.png');
export const infoTexture = textureLoader.load('public/image/textures/icons/info_element.png');

export const borderMaterial = new MeshBasicMaterial({ side: DoubleSide, depthWrite: false, transparent: true, color: 0xffffff, opacity: 0.3 });
