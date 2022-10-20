import gsap, { RoughEase, Linear } from 'gsap/all';
import {
    Mesh,
    MeshBasicMaterial,
    DoubleSide
} from 'three';

import { SCENE_INTERACTION } from '../../constants/scene';
import { VRObject3D } from './VRObject3D';

import { textureLoader, textureToggleGeometry, sceneChangeGeometry, lockedTexture, menuPositionCircleGeometry, emptyTexture } from './helpers/texturesAndGeometries';


class VRSceneChangeObject extends VRObject3D {

    constructor(containerName, camera, texture, x, y, z, model) {

        super(containerName);
        this.camera = camera;
        this.targetRoomId;
        this.locked = false;
        this.model = model;

        this.material = new MeshBasicMaterial({ map: texture, side: DoubleSide, transparent: true });
        this.mesh = new Mesh(sceneChangeGeometry, this.material);
        this.mesh.type = 'sceneChange';
        this.mesh.name = 'sceneChange';
        this.name = 'sceneChange';

        // INIT
        this.camera !== null ? this._setInitialPosRot() : this.setPosition(x, y, z);

        this.add(this.mesh);

        this.mesh.groupDetails = { title: this.model.languageObject['scene-change'].text, icon: 'meeting_room', editTitle: this.model.languageObject['edit-scene-change'].text, dataLang: 'edit-scene-change' }

        this.addElement('locakbleMesh', textureToggleGeometry, lockedTexture, 'lockable', 17, 17, 10);

        this.editControls();

        this.currentUser = null;


        model.addEventListener(SCENE_INTERACTION.JUMP_TO_OBJECT, (e) => {
            if (e.data.sceneId === this.targetRoomId) {
                const data = {
                    element: this.mesh,
                    onComplete: e.data.onComplete ? e.data.onComplete : null,
                };
                this.model.customSceneChange(data)
                console.log('custom scene change', data)
            }
        });
        model.addEventListener(SCENE_INTERACTION.SET_LOCKED_ROOMS, (e) => {
            const { lockedRooms } = this.model;
            this.unlock();
            if (!lockedRooms) return;
            if (lockedRooms[this.targetRoomId]) {
                this.lock();
            }
        }
        );
        model.addEventListener(SCENE_INTERACTION.SCENE_INITIALISED, (e) => {
            ///test if has locked rooms
            if (!e || !e.data || !e.data.payload) { return }
            const {
                data: { currentUsers: { lockedRooms } }
            } = e;
            if (!lockedRooms) {
                return
            }
            this.unlock()
            if (lockedRooms[this.targetRoomId]) {
                this.lock();
            }
        });
        return this;
    }

    setTargetRoomId = (id) => {
        this.targetRoomId = id;
    };

    getTargetId = (id) => {
        return this.targetRoomId;
    }

    lock() {
        if (this.model.userIsOwner) {
            return
        }
        this.locakbleMesh.visible = true;
        this.locked = true;
        $(`.indicator-${this.mesh.id}`).addClass("isLocked");
    }
    
    unlock() {
        $(`.indicator-${this.mesh.id}`).removeClass("isLocked");
        this.locakbleMesh.visible = false;
        this.locked = false;
    }

    onClick() {
        const { x, y, z } = this.locakbleMesh.position
        gsap.fromTo(this.locakbleMesh.position, { x: x + Math.PI / 4 }, {
            duration: .75,
            x: x,
            ease: RoughEase.ease.config({ strength: 8, points: 20, template: Linear.easeNone, randomize: false }),
            clearProps: "x"
        });
    }

    setDbConfig(config) {
        super.setDbConfig(config);
        // console.log(this.dbConfig)
        if (!this.dbConfig.hasOwnProperty("image")) return;
        if (this.dbConfig.image.url === "") return;

        const { url, aspectRatio } = this.dbConfig.image;
        this.customIcon = true;

        textureLoader.load(url, (texture) => {
            this.mesh.material.map = texture;
            this.setGeometry(url, aspectRatio);
        });
    }

    addDummyPositionElement() {
        this.addElement('dummySceneChangeMesh', menuPositionCircleGeometry, emptyTexture, 'sceneChangeDummy', 0, 0, 0);
        this.dummySceneChangeMesh.rotation.copy(this.camera.rotation);
        this.dummySceneChangeMesh.lookAt(this.camera.position);
    }
}

export { VRSceneChangeObject };