import {
    Mesh,
    DoubleSide,
    MeshBasicMaterial
  } from 'three';

import { VRObject3D } from './VRObject3D';
import { squareGeometry } from './helpers/texturesAndGeometries';


class VRInfoElement extends VRObject3D {
  
    constructor(containerName, camera, texture, x, y, z, model) {
  
        super(containerName);

        this.camera = camera;
        this.material = new MeshBasicMaterial({ map: texture, side: DoubleSide, transparent: true });

        this.mesh = new Mesh(squareGeometry, this.material);
        this.mesh.type = 'infoElement';
        this.mesh.name = 'infoElement';
        this.name = 'infoElement';

        this.model = model;

        // INIT
        this.camera !==null ? this._setInitialPosRot() : this.setPosition(x, y, z);

        this.add(this.mesh);

        this.mesh.groupDetails = {title: this.model.languageObject['info-element'].text, icon: 'info', editTitle: this.model.languageObject['edit-info-element'].text, dataLang: 'edit-info-element'}
        
        this.editControls();

        //result
        return this; 
    }
  
    showEditModal = () =>{
        $(".info-element-modal .modal-header-title").text(this.model.languageObject['edit-info-element'].text);
        $(".info-element-modal .modal-header-title").attr('data-lang', 'edit-info-element');
        $(".info-element-modal").addClass("edit");

        const { data } = this.dbConfig;
        const { title, description, button, image } = data;
       
        const isLocation = button.hasOwnProperty('isLocation') ? button.isLocation : false;
        
        $("#info-element-title").val(title);
        tinymce.get("info-element-description1").setContent(description);
        $("#info-element-button-text").val(button.text);
        $("#info-element-button-url").val(button.url);
        $("#info_element_image").attr('src', image || 'textures/empty.png');

        $("#locationButton").val(isLocation ? button.locationID : $("#locationButton option:first").val());
        $(".locationButton .select-selected").text(isLocation ? button.locationName : '');

        $("#upload_info_element_image .upload-watermark").toggleClass("hide", !!image);
        $("#removeInfoElementImage").toggleClass("active", image !== false);

        $("#info-element-modal").addClass("is-active");
    }

    openModal = () =>{
        const { data } = this.dbConfig;
        const { title, description, button, image } = data;

        $("#infoElementTitle").text(title);
        const imgDom = image ? `<div class='infoModalImage'><img src='${image}''></div>` : '';
        const descDom = description ? `<div class='infoModalDescription'>${JSON.parse(JSON.stringify(description))}</div>` : '';

        let wrap = '';
            wrap += imgDom;
            wrap += descDom;
        
        const isLocation = button.hasOwnProperty('isLocation') ? button.isLocation : false;
        $("#infoElementBtnUrl").toggleClass("isLocation", isLocation);

        $("#infoElementBtnUrl").attr("href", isLocation ? button.locationID : button.url);
        $("#infoElementBtnText").text(button.text);

        $("#infoElementModal footer").toggleClass("visible", button.show);
        $("#info-element-content").html(wrap);
        
        const anyDescription = descDom !== "";
        
        $("#info-element-content").toggleClass('pad-top', anyDescription && !imgDom);
        $("#info-element-content").toggleClass('pad-bot', anyDescription);
        $("#info-element-content").toggleClass('pad-bot-big', anyDescription && !button.show);
        $("#infoElementModal footer").toggleClass('no-mar', button.show && !anyDescription);

        $("#infoElementModal").addClass("is-active");
    }
}
  
export { VRInfoElement };