import { VRChairObject } from './VRChairObject';
import { VRStreamScreenObject } from './VRStreamScreenObject';
import { VRSceneChangeObject } from './VRSceneChangeObject';
import { VRProfileObject } from './VRProfileObject';
import { VRLinkObject } from './VRLinkObject';
import { VRYoutubeGhostObject } from './VRYoutubeGhostObject';
import { VRYoutubeVideoObject } from './VRYoutubeVideoObject';
import { VRPayPalDonationObject } from './VRPayPalDonationObject';
// import VRChessObject from './VRChessObject';
import { VRBaglessRoomObject } from './VRBaglessRoomObject';
import { VRShopObject } from './VRShopObject';
import { VRInfoElement } from './VRInfoElement';
import { VREmbeddedWebpageObject } from './VREmbeddedWebpageObject';


class VRPlaceObject {

    constructor(index, obj, texture, editMode = false, model, camera) {
        let element = null;
        const { id, uuid, type, name, x, y, z, scale } = obj;
        let _Z = z || 90;

        switch (type) {
            case 'guestSeat':
                element = new VRChairObject(index, null, texture, x, y, _Z, model);
                break;
            case 'screenStream':
                element = new VRStreamScreenObject(index, null, texture, x, y, _Z, model);
                break;
            case 'sceneChange':
                element = new VRSceneChangeObject(index, null, texture, x, y, _Z, model);
                element.setTargetRoomId(obj.goToSceneId);
                break;
            case 'webLink':
                element = new VRLinkObject(index, null, texture, x, y, _Z, model);
                element.setLink(obj.url);
                break;
            case 'baglessRoom':
                element = new VRBaglessRoomObject(index, null, texture, x, y, _Z, model);
                element.setLink(obj.url);
                break;
            case 'youtube':
                if (editMode) {
                    // VRYoutubeGhost - must be renamed to VRYoutubePlaceholder
                    element = new VRYoutubeGhostObject(index, null, obj.video_id, x, y, _Z, model);
                } else {
                    element = new VRYoutubeVideoObject(camera, obj.video_id, x, y, _Z);
                    element.scale.set(scale, scale, scale);
                    element.mesh.dbConfig = obj;
                    return element;
                }
                break;
            case 'profile':
                element = new VRProfileObject(index, null, texture, x, y, z, model);
                break;
            case 'chessGame':
                // element = new VRChessObject(index, null, texture, x, y, z, model);
                break;
            case 'payPalDonation':
                element = new VRPayPalDonationObject(index, null, texture, x, y, z, model);
                break;
            case 'shopLink':
                element = new VRShopObject(index, null, texture, x, y, z, model);
                break;
            case 'infoElement':
                element = new VRInfoElement(index, null, texture, x, y, z, model);
                break;
            case 'embeddedWebpage':
                element = new VREmbeddedWebpageObject(index, null, texture, x, y, z, model);
                break;
        }
        const _id = id || uuid;
        element.setId(_id);
        element.setDbConfig(obj);
        element.setInitRotations();
        element.mesh.scale.set(scale, scale, scale);
        element.addMenuPosition();
        return element;
    }
}

export { VRPlaceObject }