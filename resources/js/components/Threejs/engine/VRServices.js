import {EventDispatcher} from 'three';
  
const DATA_EVENTS = {
    WORLD_FETCHED: 'WORLD_FETCHED',
    SCENE_FETCHED: 'SCENE_FETCHED',
    WORLD_UPDATED: 'WORLD_UPDATED',
    SCENE_UPDATED: 'SCENE_UPDATED',
};

class VRServices extends EventDispatcher {
    constructor() {
        super();
    }

    /**
     * @public
     * @param {URL/world id} url 
     */
    getWorldData = (url='') => {
        this.dispatchEvent({ type: DATA_EVENTS.WORLD_FETCHED, data: {} });
    }

    /**
     * @public
     * @param {URL/world id} url 
     */
    updateWorldData = (url='') => {
    }

}

export { VRServices, DATA_EVENTS }