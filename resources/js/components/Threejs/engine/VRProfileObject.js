/**
 
{
    "id": "de987c3f-5261-494e-9e65-456c2bf74449",
    "type": "profile",
    "name": "Profil 1",
    "canHasStatus": false,
    "x": 360,
    "y": 90,
    "scale": 1,
    "distance": 0.5,
    "initialVisible": true,
    "profile": {
        "avatarImage": {
            "type": "image",
            "mediumPath": "virtualRealityFiles/d865b2314bc48adc128a4a96189a6e0b3256bec2.jpg"
        },
        "name": "Ana",
        "email": "ana@inorbit.hr"
    }
}

 */
import { Mesh } from 'three';

import { VRProfileHelper } from './VRProfileHelper';

// import { GLOBAL_EVENTS } from '../../constants/global';
import { textureLoader, chairCircleGeometry } from './helpers/texturesAndGeometries';


class VRProfileObject extends VRProfileHelper {

    constructor(containerName, camera, texture, x, y, z, model) {

        super(containerName, camera, texture, model);

        this.dbConfig = null;
        this.ownerIsOnline = false;

        this.mesh = new Mesh(chairCircleGeometry, this.material);

        this.mesh.type = 'profile';
        this.mesh.name = 'profile';
        this.name = 'profile';
        this.add(this.mesh);

        // this.camera !== null ? this._setInitialPosRot() : this.setPosition(x, y, z);
        this.setPosition(x, y, z);

        this.mesh.groupDetails = { title: this.model.languageObject['profile'].text, icon: 'person', editTitle: this.model.languageObject['edit-profile'].text, dataLang: 'edit-profile' }

        this.editControls();

        !this.model.editMode && this.addMood();
        !this.model.editMode && this.addBorder();

        this.eventListeners();

        return this;
    }

    eventListeners() {
        if (this.model.editMode)
            return;

        // this.model.addEventListener(GLOBAL_EVENTS.SESSION_DISCONNECTED, (data) => {
        //     if (data.id === this.dbConfig.profile.userId) {
        //         this.ownerOffline();
        //     }
        // });

        // this.model.addEventListener(GLOBAL_EVENTS.OWNER_STATUS, (e) => {
        //     e.data ? this.ownerOnline(e.data) : this.ownerOffline();
        // });

        // this.model.addEventListener(GLOBAL_EVENTS.MOOD_CHANGED, (e) => {
        //     const { senderId, data } = e.data;

        //     if (this.userId !== null) {
        //         if (this.userId === senderId) {
        //             this.showOrUpdateMood(data.newMood);
        //         }
        //     }
        // });

        // this.model.addEventListener(GLOBAL_EVENTS.SESSION_CONNECTED, (e) => {
        //     if (this.userId !== null) {
        //         if (this.userId === e.data.userId) {
        //             this.ownerOnline(e.data);
        //         }
        //     }
        // });

        // this.model.addEventListener(GLOBAL_EVENTS.AVATAR_CHANGED, (e) => {
        //     const { senderId, data } = e.data;

        //     if (this.userId !== null) {
        //         if (this.userId === senderId) {
        //             if (!this.dbConfig.profile.hasOwnProperty('dynamicProfileAvatar')) {
        //                 textureLoader.load(data.userAvatarUrl, (texture) => {
        //                     this.material.map = texture;
        //                 });
        //                 return;
        //             }

        //             this.dbConfig.profile.dynamicProfileAvatar && textureLoader.load(data.userAvatarUrl, (texture) => {
        //                 this.material.map = texture;
        //             });
        //         }
        //     }
        // });

    }

    getProfileInfo() {
        return this.dbConfig ? this.dbConfig.profile : { wpId: null, avatarImage: { mediumPath: null }, email: '', name: '' };
    }

    showUserOptions() {
        if (this.model.userIsOwner) {
            this.model.info('info', this.model.languageObject['info-owner'].text);
            return
        }
        $(".cta-menu").removeClass("is-active");

        if (this.ownerIsOnline) {
            $("#sendMessageToOwner").removeClass("disabled");
            $("#ownerVideoCall").toggleClass("disabled", this.mood !== 1);
        } else {
            $("#sendMessageToOwner").addClass("disabled");
            $("#ownerVideoCall").addClass("disabled");
        }
        $("#room-owner-menu").addClass("is-active");

        $("#ownerIsFriend").hide();
        $("#ownerAddAsFriend").hide();
        if (this.model.config.userId === this.userId) {
            return
        }
        if (this.userId && !this.model.friendsMap[this.userId]) {
            $("#ownerIsFriend").hide();
            $("#ownerAddAsFriend").show();
        } else {
            $("#ownerIsFriend").show();
            $("#ownerAddAsFriend").hide();
        }

    }

    showInfo() {
        if (!this.dbConfig)
            return;
        this.model.showUserInfo({ data: { hasProfile: true, userName: this.dbConfig.profile.userName, userId: this.dbConfig.profile.userId, wpId: this.dbConfig.profile.wpId, userAvatarUrl: this.dbConfig.profile.avatarImage.mediumPath }, eventOrigin: '3Dobject' });
    }

    ownerOnline(data) {
        this.moodMesh.visible = true;
        this.ownerIsOnline = true;
        this.userInfo = data;
        this.userData = data;
        this.showOrUpdateMood(data.currentUserMood);
    }

    ownerOffline() {
        this.moodMesh.visible = false;
        this.ownerIsOnline = false;
        this.hideUserOptions();
        $("#room-owner-menu").removeClass("is-active");
    }

    checkIfOwnerIsOnline() {
        this.userId = this.dbConfig.profile.userId;
        !this.model.editMode && this.model.dispatchEvent({ type: GLOBAL_EVENTS.CHECK_OWNER_STATUS, userId: this.dbConfig.profile.userId });
    }

    setDbConfig(config) {
        super.setDbConfig(config);
        // console.log('config',config);
        this.checkIfOwnerIsOnline();

        if (!config.profile.hasOwnProperty('dynamicProfileAvatar')) {
            this.useWPAvatarImage(); // by default we will use dynamic owner image on profile objects
            return;
        }

        config.profile.dynamicProfileAvatar && this.useWPAvatarImage(); // check typeof dynamicProfileAvatar, it should be boolean not string
    }

    useWPAvatarImage() {
        fetch(`https://bagless.io/wp-json/user_data?wpId=${this.dbConfig.profile.wpId}`).then(response => response.json()).then(data => {
            if (!data.hasOwnProperty('avatar')) return;
            if (!data.avatar) return;
            textureLoader.load(data.avatar, (texture) => {
                this.material.map = texture;
            });
        });
    }

}

export { VRProfileObject };