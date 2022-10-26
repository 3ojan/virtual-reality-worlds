import { Vector3, Mesh, MeshPhongMaterial, Color, NoBlending } from 'three';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { VRObject3D } from './VRObject3D';
import { youtubePlaneGeometry } from './helpers/texturesAndGeometries';


class VRYoutubeVideoObject extends VRObject3D {

    constructor(camera, videoID, x, y, z) {

        super();
        this.camera = camera;

        const div = document.createElement('div');
        div.setAttribute("class", "video_element");
        div.removeAttribute("style");

        const iframe = document.createElement('iframe');
        iframe.setAttribute('allowfullscreen', true);
        // iframe.src = `https://www.youtube.com/embed/${videoID}?rel=0`;
        iframe.src = `https://www.youtube.com/embed/${"cGZ_IOV4o1A"}?rel=0`;
        iframe.setAttribute('title', videoID);
        div.appendChild(iframe);

        const material = new MeshPhongMaterial({
            opacity: 0,
            transparent: true,
            color: new Color(0x000000),
            blending: NoBlending
        })

        this.mesh = new Mesh(youtubePlaneGeometry, material);
        const object = new CSS3DObject(div);
        if (camera !== null) {
            object.position.copy(camera.position);
            object.rotation.copy(camera.rotation);
            object.translateZ(-540); // -900
        } else {
            object.position.copy(new Vector3(x, y, z));
        }


        this.mesh.dbConfig = {};

        object.add(this.mesh);
        object.mesh = this.mesh;

        object.type = 'youtube';
        object.name = 'youtube';

        return object;
    }

}

export { VRYoutubeVideoObject };