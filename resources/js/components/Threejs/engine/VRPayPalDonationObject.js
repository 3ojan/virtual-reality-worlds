import {
    Mesh,
    DoubleSide,
    MeshBasicMaterial
  } from 'three';

import { VRObject3D } from './VRObject3D';
import { textureLoader, linkGeometry, paypalDonateTexture } from './helpers/texturesAndGeometries';


class VRPayPalDonationObject extends VRObject3D {
  
    constructor(containerName, camera, texture, x, y, z, model) {
  
        super(containerName);

        this.model = model;

        this.camera = camera;
        this.material = new MeshBasicMaterial({ map: texture, side: DoubleSide, transparent: true });

        this.mesh = new Mesh(linkGeometry, this.material);
        this.mesh.type = 'payPalDonation';
        this.mesh.name = 'payPalDonation';
        this.name = 'payPalDonation';

        // INIT
        this.camera !==null ? this._setInitialPosRot() : this.setPosition(x, y, z);

        this.add(this.mesh);

        this.mesh.groupDetails = {title: this.model.languageObject['paypal-donation'].text, icon: 'paid', editTitle: this.model.languageObject['edit-paypal-donation'].text, dataLang: 'edit-paypal-donation'}
        
        this.editControls();

        //result
        return this; 
    }

    setDefaultTexture = () =>{
        this.mesh.geometry = linkGeometry;
        this.mesh.material.map = paypalDonateTexture;
    }

    setDbConfig(config){
        super.setDbConfig(config);
        
        if( !this.dbConfig.hasOwnProperty("image") ) return;
        if( this.dbConfig.image.url === "" ) return;

        const { url, aspectRatio } = this.dbConfig.image;
        this.customIcon = true;
        
        textureLoader.load(url, (texture)=>{
            this.mesh.material.map = texture;
            this.setGeometry( url, aspectRatio );
        });
    }

    showDonationModal = () => {
        $("#donation_iframe").length && $("#donation_iframe").remove();
        this.dbConfig.image.url && $("#paypal_donation_image").attr('src', this.dbConfig.image.url);
        $("#paypal_donation_image").toggleClass('hidden', this.dbConfig.image.url === "");
        $(".uploadThumbnailWrapper").addClass('hidden');
        $("#paypal_donation_text").html(JSON.parse(JSON.stringify(this.dbConfig.donationDescription)));
        $("#paypal_donation_text").toggleClass('hidden', this.dbConfig.donationDescription === "");
        $("#paypal_donation_url").val(this.dbConfig.donationURL);
        $(".paypal_donation_holder ").addClass('is-active');
    }
  
}
  
export { VRPayPalDonationObject };