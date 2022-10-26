import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector, connect } from 'react-redux';
// import * as THREE from "three";
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { Box3, Clock, TextureLoader, Color, WebGLRenderer, Group, Scene, Raycaster, PerspectiveCamera, SphereGeometry, MeshBasicMaterial, Mesh, PlaneGeometry, RepeatWrapping, Vector3, BackSide, LoadingManager, ShaderMaterial, Audio, AudioListener, AudioLoader, Object3D, BoxGeometry, Euler } from 'three';
import { VRProfileHelper } from './engine/VRProfileHelper';
import { VRChairObject } from './engine/VRChairObject';
import { VRPlaceObject } from './engine/VRPlaceObject';
import { getStringifiedWorldData, updateJSON, _ray_tracing, cloneObject } from './engine/helpers/scene';
import { getTexture } from './engine/helpers/texturesAndGeometries';
import VRPlaneToSphere from './engine/VRPlaneToSphere';

class ViewGLClass extends React.Component {

  constructor(props) {
    super(props);
    props.myRef.current = this;
    this.myRef = React.createRef();
    this.css3DContainerRef = React.createRef();
    this.worldData = null;
    console.log(props)
  }

  someFunction = () => {
    console.log("called some function")
  }
  setWorldData = (data) => {
    this.worldData = cloneObject(data);
    this.initWorld();
  }
  initWorld = () => {
    const { scenes } = this.worldData.data;
    let currentScene = { ...scenes[2] };

    const updateSphereTexture = (newBgImage) => {
      newBgImage.wrapS = RepeatWrapping;
      newBgImage.repeat.x = - 1;
      mesh.material.map = newBgImage;
      mesh.material.needsUpdate = true;
    }

    let mesh;
    const geometry = new SphereGeometry(1200, 64, 64);
    const material = new MeshBasicMaterial({
      side: BackSide,
    });
    mesh = new Mesh(geometry, material);

    this.textureLoader = new TextureLoader();
    this.textureLoaderSilent = new TextureLoader();
    this.textureLoaderSilent.load(currentScene.background.mediumPath, (texture) => {
      updateSphereTexture(texture);
    });

    const scene = new Scene();
    const interactionGroup = new Group();
    scene.add(interactionGroup);
    const raycaster = new Raycaster();
    const camera = new PerspectiveCamera(70, 2, 0.001, 10000);
    camera.position.set(0, 0, 10);
    const initialCameraPosition = camera.quaternion.clone();
    camera.position.z = 10;
    const renderer = new WebGLRenderer({ antialias: true });
    const canvas = renderer.domElement;
    let controlsActive = false;
    // const canvas = props.canvasRef;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    let max = 1;
    let min = -1;
    let bendValue = 0;

    scene.add(mesh)
    // mesh.visible = false;
    window.scene = scene;

    ///rednderer    
    renderer.setClearColor("#0000");
    canvas.current = renderer.domElement;
    this.myRef.current.appendChild(canvas.current);
    this.css3DRenderer = new CSS3DRenderer();
    this.css3DContainerRef.current.appendChild(this.css3DRenderer.domElement);
    const css3dre = this.css3DRenderer;
    ///rednderer    

    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
        css3dre.setSize(width, height, false);
      }
      return needResize;
    }

    let clock = new Clock();
    let planeToSphere;

    function render(time) {
      const fps = 1 / 60;
      time += fps;
      css3dre.render(scene, camera);
      renderer.render(scene, camera);
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      controls && controls.update();
      requestAnimationFrame(render);

      // if (planeToSphere) {
      //   const t = Math.sin(clock.getElapsedTime());
      //   planeToSphere.update(Math.sin(clock.getElapsedTime()) * 0.5 + 0.5)
      //   if (t < -0.999) {
      //     planeToSphere.spherePlane.visible = false;
      //     mesh.visible = true;
      //   }
      // }
    };




    ///Controls
    const controls = new OrbitControls(camera, this.css3DContainerRef.current);
    controls.addEventListener('start', () => {
      controlsActive = true;
    });
    controls.addEventListener('change', () => {
      controlsActive = false;
    });
    // controls.enabled = false;
    controls.enableDamping = true;
    controls.dampingFactor = this.isMobile ? 0.15 : 0.25;
    controls.rotateSpeed = this.isMobile ? 1 : 0.25;
    controls.enablePan = false;
    controls.enableZoom = (!this.editMode || this.isMobile) ? true : false;

    controls.rotateSpeed *= -1;

    const _addElementsToScene = (objects) => {
      objects.forEach((item, index) => {
        console.log(item)
        if (item.type === "chessGame")
          return
        const { id, x, y, z } = item;
        let obj;
        obj = new VRPlaceObject(index, item, getTexture(item.type), null, null, camera);
        scene.add(obj);
        obj.mesh.lookAt(camera.position);
        if (item.type === "youtube") {
          obj.lookAt(camera.position)
        }
        obj.withStaticRotations && obj.setInitRotations(true);
        obj.setDistance && obj.setDistance(item.distance);
        obj.setPosition && obj.setPosition(x, y, z);
        // obj.setAxisRotations();
        // obj.setId(id);
        // obj.showOrUpdateMood(2)
      })

      planeToSphere = new VRPlaneToSphere({ texture: getTexture("custom", currentScene.background.mediumPath) })
      // scene.add(planeToSphere.spherePlane);
      planeToSphere.spherePlane.position.z = -100;

      var bbox = new Box3().setFromObject(planeToSphere.spherePlane);
      // planeToSphere.spherePlane.position.x -= bbox.max.x / 2;
      window.planeToSphere = planeToSphere;

    }
    _addElementsToScene(currentScene.objects);
    requestAnimationFrame(render);

    // MOUSE MOVE EVENT
    document.addEventListener("mousemove", (event) => {
      // if (this.controlsActive) {
      let intersect = _ray_tracing(event, scene.children, raycaster, camera, this.css3DContainerRef.current);

      if (intersect.length) {
        const mesh = intersect[0].object;
        const cond = mesh.visible && mesh.type === 'baglessRoom';

        if (cond) {
          const parent = mesh.parent.type === 'baglessRoom' ? mesh.parent.parent : mesh.parent;
          const targetRoomName = `: ${parent.targetRoomName}` || '';
          // $("#tooltip-target-bagless-room").text(targetRoomName);
          // $("#dynamic-floating-tooltip").css({ left: `${event.clientX}px`, top: `${event.clientY}px` });
        }

        // $("#dynamic-floating-tooltip").toggleClass("visible", cond);
        // $("#css3d").toggleClass("hide-cursor", cond);
      }
      // }
    });
    function onDocumentMouseWheel(event) {
      const fov = camera.fov + event.deltaY * 0.05;
      // camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
      // camera.updateProjectionMatrix();
      if (event.wheelDelta > 0) {
        bendValue -= .045;
        bendValue = (Math.max(bendValue, -1.5))
      }
      if (event.wheelDelta < 0) {
        bendValue += .045;
        bendValue = (Math.min(bendValue, 1.5))
      }
    };
    document.addEventListener("wheel", onDocumentMouseWheel);

    const _editModeControls = () => {
      // DRAG OBJECTS
      const dragControls = new DragControls(scene.children, camera, this.css3DContainerRef.current);
      this.dragControls = dragControls;

      dragControls.addEventListener('dragstart', (event) => {
        console.log(event)
        if (event.object.name === "" || event.object.visible === false || event.object.name === 'settings' || event.object.name === 'delete') {
          return;
        }
        controls.enabled = false;
        // this.roomGroup.rotation.y = 0;
      });

      dragControls.addEventListener('drag', (event) => {
        if (event.object.name === "" || event.object.visible === false || event.object.name === 'settings' || event.object.name === 'delete') {
          return;
        }
        const { min, max } = event.object.parent.getLimits();
        event.object.position.clampLength(min, max);
        event.object.rotation.copy(camera.rotation);
        event.object.lookAt(camera.position);

        if (event.object.parent.name === "youtube") {
          event.object.parent.updatePoster();
        }
      });

      dragControls.addEventListener('dragend', (event) => {
        if (event.object.name === "" || event.object.visible === false || event.object.name === 'settings' || event.object.name === 'delete') {
          return;
        }
        controls.enabled = true;
        event.object.rotation.copy(camera.rotation);
        event.object.lookAt(camera.position);

        event.object.parent.resetRotations();

        updateJSON(event.object, null, currentScene.objects);
        this.props.onSave(14, getStringifiedWorldData(currentScene, scenes))
      });
    }
    _editModeControls();

    this.css3DContainerRef.current.addEventListener("click", (event) => {

      event.preventDefault();

      if (controlsActive) {

        let intersect = _ray_tracing(event, scene.children, raycaster, camera, canvas);

        // $(".cta-menu").removeClass("is-active");
        // this.model.lastScreenShareIClicked !== null && this.model.lastScreenShareIClicked.removeBorderHighlight();
        // this.model.lastPeerChairIClicked !== null && this.model.lastPeerChairIClicked.removeBorderHighlight();

        if (intersect.length === 0) {
          this.model.resetPeerChairOptions();
        } else {

          if (intersect[0].object.visible) {

            this.elementSelected = intersect[0].object;

            // $("#elementSelected").val(this.elementSelected.id);


            switch (this.elementSelected.type) {
              case 'guestSeat': this._chairClickEvent(); break;
              case 'screenStream':
                this.model.lastScreenShareIClicked = this.elementSelected.parent;
                this.sizes.width < this.mobileBreakpoint && this.elementSelected.parent.addBorderHighlight();
                $("#screen-share-menu").addClass("is-active");
                break;
              case 'sceneChange': this._sceneChangeClickEvent(); break;
              case 'webLink': this._linkClickEvent(); break;
              case 'baglessRoom': this._linkClickEvent(true); break;
              case 'profile': this._profileClickEvent(); break;
              case 'userInfo': this._userInfoEvent(); break;
              case 'chessGame': this._chessGameClickEvent(); break;
              case 'chessAvatar': this._chessGameAvatarClickEvent(); break;
              case 'payPalDonation': this._payPalDonationClickEvent(); break;
              case 'shopLink': this._shopLinkClickEvent(); break;
              case 'embeddedWebpage': this._embeddedWebpageClickEvent(); break;
            }
          } else {
            // this.model.resetPeerChairOptions();

            // if (intersect[0].object.type === 'sceneChangeDummy') {
            //   this.elementSelected = intersect[0].object.parent;
            //   $("#elementSelected").val(this.elementSelected.id);
            //   this._sceneChangeClickEvent();
            // }
          }
        }
      }

    });
  }

  componentDidMount() {
    console.log(this.css3DContainerRef)
    console.log(this.myRef)
  }


  render() {
    return (
      <div style={container}>
        <div style={container}>
          <div style={webGlStyle} ref={this.myRef} />
          <div style={css3dStyle} ref={this.css3DContainerRef} />
        </div >
      </div>
    )
  }
}

const mapStateToProps = state => ({
  world: state.world
});

const mapDispatchToProps = () => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps()
)(ViewGLClass);


const webGlStyle = {
  width: "100%",
  height: "100%",
  position: "absolute",
  top: 0,
  left: 0,
}
const css3dStyle = {
  zIndex: 9,
}
const container = {
  width: "100%",
  height: "100%",
  position: "relative",
}