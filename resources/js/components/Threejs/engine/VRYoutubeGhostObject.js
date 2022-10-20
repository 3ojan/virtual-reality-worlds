import {
    Mesh,
    MeshPhongMaterial,
    Color,
    NoBlending,
    Quaternion,
    Vector3
} from 'three';

import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { VRObject3D } from './VRObject3D';
import { youtubePlaneGeometry } from './helpers/texturesAndGeometries';

class VRYoutubeGhostObject extends VRObject3D {

    video_url_id = null
  
    constructor(containerName, camera, video_id, x, y, z, model) {
  
        super(containerName);
        this.camera = camera;
        this.video_url_id = video_id;
        this.limits = {
            min: 280,
            max: 800,
            distance: 540
        }

        this.model = model;

        this.material = new MeshPhongMaterial({
            opacity	: 0,
            transparent: true,
            color	: new Color( 0x000000 ),
            blending: NoBlending
        })

        this.mesh = new Mesh(youtubePlaneGeometry, this.material);
        this.mesh.type = 'youtube';
        this.mesh.name = 'youtube';
        this.name = 'youtube';
          
        // POSTER
        const wrapImg = document.createElement('div');
        wrapImg.setAttribute('class', 'youtube_poster_wrapper');
        const img = document.createElement('img');
        img.setAttribute('class', 'youtube_poster');
        img.setAttribute('src', `https://img.youtube.com/vi/${this.video_url_id}/0.jpg`);
        wrapImg.appendChild(img);

        
        this.youtube_poster = new CSS3DObject( wrapImg );
        this.youtube_poster.type = 'youtube_poster';
        this.youtube_poster.name = 'youtube_poster';
        
        // INIT
        this.camera !==null ? this._setInitialPosRot() : this.setPosition(x, y, z);

        this.add(this.mesh);
        this.add(this.youtube_poster);

        this.mesh.groupDetails = {title: this.model.languageObject['youtube-video'].text, icon: 'smart_display', editTitle: this.model.languageObject['edit-youtube-video'].text, dataLang: 'edit-youtube-video'}

        this.editControls();
        // this.deleteMesh.scale.set(5,5,5);
        // this.deleteMesh.translateX(-140);
        // this.deleteMesh.translateY(180);
        // this.deleteMesh.translateZ(50);
        // this.settingsMesh.scale.set(5,5,5);
        // this.settingsMesh.translateX(140);
        // this.settingsMesh.translateY(180);
        // this.settingsMesh.translateZ(50);
    
        //result
        return this; 
    }
  
    /***
     * @private
     */
    _setInitialPosRot(){
        const position = new Vector3();
        const quaternion = new Quaternion();
        const scale = new Vector3();

        this.camera.matrixWorld.decompose(position, quaternion, scale);
        this.quaternion.copy(quaternion);
        this.position.copy(position);
        
        this.mesh.translateZ( -540 );
        this.youtube_poster.translateZ( -540 );
    }

    setId(id) {
        this.unique_id = id;
        this.youtube_poster.element.setAttribute('data-id', `img_${this.unique_id}`);
    }

    setVideoId(id){
        this.video_url_id = id;
        this.setPosterSrc(id);
    }

    setPosterSrc(id){
        //TODO check if image exist
        let url = `https://img.youtube.com/vi/${id}/0.jpg`;
        this.youtube_poster.element.childNodes[0].src = url;
    }

    getVideoId(){
        return this.video_url_id;
    }

    updatePoster(){
        this.youtube_poster.position.copy(this.mesh.position);
        this.youtube_poster.quaternion.copy(this.mesh.quaternion);
        this.youtube_poster.rotation.copy(this.mesh.rotation);
        this.youtube_poster.scale.copy(this.mesh.scale);
    }

    toggleSelect(){
        this.youtube_poster.element.childNodes[0].classList.toggle('active');
    }

    setAxisRotations(axis, angle){
        super.setAxisRotations(axis, angle);
        this.updatePoster();
    }

}
  
export { VRYoutubeGhostObject };