import {
    Mesh,
    DoubleSide,
    MeshBasicMaterial
  } from 'three';

import { VRObject3D } from './VRObject3D';
import { squareGeometry, textureLoader } from './helpers/texturesAndGeometries';


class VREmbeddedWebpageObject extends VRObject3D {
  
    constructor(containerName, camera, texture, x, y, z, model) {
  
        super(containerName);

        this.camera = camera;
        this.material = new MeshBasicMaterial({ map: texture, side: DoubleSide, transparent: true });

        this.mesh = new Mesh(squareGeometry, this.material);
        this.mesh.type = 'embeddedWebpage';
        this.mesh.name = 'embeddedWebpage';
        this.name = 'embeddedWebpage';

        this.model = model;

        // INIT
        this.camera !==null ? this._setInitialPosRot() : this.setPosition(x, y, z);

        this.add(this.mesh);

        this.mesh.groupDetails = {title: this.model.languageObject['embedded-webpage'].text, icon: 'info', editTitle: this.model.languageObject['edit-embedded-webpage'].text, dataLang: 'edit-embedded-webpage'}
        
        this.editControls();

        //result
        return this; 
    }
  
    showEditModal = () =>{
        $("#embedded-webpage-modal .modal-header-title").text(this.model.languageObject['edit-embedded-webpage'].text);
        $("#embedded-webpage-modal .modal-header-title").attr('data-lang', 'edit-embedded-webpage');
        $("#embedded-webpage-modal").addClass("edit");

        const { iframe, image } = this.dbConfig;

        $("#embedded_webpage_image").attr('src', image.url || 'textures/empty.png');
        $("#embedded-webpage-iframe-url").val(iframe);
        $("#embedded_webpage_image_aspect_ratio").val(image.aspectRatio);

        $("#upload_embedded_webpage_image .upload-watermark").toggleClass("hide", image.url !== "");
        $("#removeEmbeddedWebpageImage").toggleClass("active", image.url !== "");

        $("#embedded-webpage-modal").addClass("is-active");
    }

    openModal = () =>{
        const { iframe } = this.dbConfig;
        $("#embedded-webpage-content").html(`<iframe src="${iframe}"></iframe>`);
        $("#embeddedWebpageModal").addClass("is-active");
    }

    setDbConfig(config) {
        super.setDbConfig(config);
        if (this.dbConfig.image.url === "") return;

        const { url, aspectRatio } = this.dbConfig.image;
        this.customIcon = true;

        textureLoader.load(url, (texture) => {
            this.mesh.material.map = texture;
            this.setGeometry(url, aspectRatio);
        });
    }
}
  
export { VREmbeddedWebpageObject };