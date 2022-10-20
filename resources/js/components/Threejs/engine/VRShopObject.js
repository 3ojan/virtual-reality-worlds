import {
    Mesh,
    DoubleSide,
    MeshBasicMaterial,
    PlaneGeometry
  } from 'three';

import { VRObject3D } from './VRObject3D';
import { textureLoader, linkGeometry } from './helpers/texturesAndGeometries';


class VRShopObject extends VRObject3D {
  
    constructor(containerName, camera, texture, x, y, z, model) {
  
        super(containerName);

        this.model = model;

        this.camera = camera;
        this.link = '';
        this.material = new MeshBasicMaterial({ map: texture, side: DoubleSide, transparent: true });

        this.mesh = new Mesh(linkGeometry, this.material);
        this.mesh.type = 'shopLink';
        this.mesh.name = 'shopLink';
        this.name = 'shopLink';

        // INIT
        this.camera !==null ? this._setInitialPosRot() : this.setPosition(x, y, z);

        this.add(this.mesh);

        this.mesh.groupDetails = {title: this.model.languageObject['product'].text, icon: 'shopping_cart', editTitle: this.model.languageObject['edit-product'].text, dataLang: 'edit-product'}
        
        this.editControls();

        //result
        return this; 
    }

    setLink = (link) =>{
        this.link = link;
    }

    getLink = () =>{
        return this.link;
    }

    setGeometry = (src, aspectRatio, updateTexture = false) =>{
        if(src){
            const max = 60;
            aspectRatio *= 1;

            let width = 1;
            let height = 1;

            if(aspectRatio < 0){
                // portrait
                width = max * aspectRatio;
                height = max;
            }else{
                // landscape
                width = max;
                height = max / aspectRatio;
            }

            
            this.mesh.geometry = new PlaneGeometry(width, height);
            this.mesh.material.needsUpdate = true;
            updateTexture && textureLoader.load(src, texture => { this.mesh.material.map = texture; this.mesh.material.needsUpdate = true; });
        }
    }

    setDbConfig(config){
        super.setDbConfig(config);
        // console.log(this.dbConfig)
        if( !this.dbConfig.hasOwnProperty("image") ) return;
        if( this.dbConfig.image.url === "" ) return;

        const { url, aspectRatio } = this.dbConfig.image;
        
        textureLoader.load(url, (texture)=>{
            this.mesh.material.map = texture;
            this.setGeometry( url, aspectRatio );
        });
    }
  
}
  
export { VRShopObject };