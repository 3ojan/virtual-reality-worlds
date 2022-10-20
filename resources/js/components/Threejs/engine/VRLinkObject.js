import {
    Mesh,
    DoubleSide,
    MeshBasicMaterial
  } from 'three';

import { VRObject3D } from './VRObject3D';
import { textureLoader, linkGeometry, linkTexture } from './helpers/texturesAndGeometries';


class VRLinkObject extends VRObject3D {
  
    constructor(containerName, camera, texture, x, y, z, model) {
  
        super(containerName);

        this.camera = camera;
        this.link = '';
        this.material = new MeshBasicMaterial({ map: texture, side: DoubleSide, transparent: true });

        this.mesh = new Mesh(linkGeometry, this.material);
        this.mesh.type = 'webLink';
        this.mesh.name = 'webLink';
        this.name = 'webLink';

        this.model = model;

        // INIT
        this.camera !==null ? this._setInitialPosRot() : this.setPosition(x, y, z);

        this.add(this.mesh);

        this.mesh.groupDetails = {title: this.model.languageObject['image-link'].text, icon: 'link', editTitle: this.model.languageObject['edit-image-link'].text, dataLang: 'edit-image-link'}
        
        this.editControls();

        //result
        return this; 
    }

    setDefaultTexture = () =>{
        this.mesh.geometry = linkGeometry;
        this.mesh.material.map = linkTexture;
    }

    setCustomTexture = (link) =>{
        console.log('this.mesh',this.mesh);
        textureLoader.load(link, (texture)=>{
            this.mesh.material.map = texture;
        });
    }

    setLink = (link) =>{
        this.link = link;
    }

    getLink = () =>{
        return this.link;
    }

    setDbConfig(config){
        super.setDbConfig(config);
        if( !this.dbConfig.hasOwnProperty("image") ) return;
        if( this.dbConfig.image.url === "" ) return;
        
        config.openNewWindow = this.dbConfig.openNewWindow;
        const { url, aspectRatio } = this.dbConfig.image;
        this.customIcon = true;
            
        textureLoader.load(url, (texture)=>{
            this.mesh.material.map = texture;
            this.setGeometry( url, aspectRatio );
        });
    }
  
}
  
export { VRLinkObject };