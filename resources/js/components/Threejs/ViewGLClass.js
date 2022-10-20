import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
// import * as THREE from "three";
import { CSS3DRenderer } from 'three-css3drenderer';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { TextureLoader, WebGLRenderer, Group, Scene, Raycaster, PerspectiveCamera, SphereGeometry, MeshBasicMaterial, Mesh, PlaneGeometry, RepeatWrapping, Vector3, BackSide, LoadingManager, ShaderMaterial, Audio, AudioListener, AudioLoader, Object3D, BoxGeometry, Euler } from 'three';
import { VRProfileHelper } from './engine/VRProfileHelper';
import { VRChairObject } from './engine/VRChairObject';
import { getStringifiedWorldData, updateJSON, _ray_tracing, cloneObject } from './engine/helpers/scene';

export default class ViewGLClass extends React.Component {

  constructor(props) {
    super(props);
    props.myRef.current = this;
    this.myRef = React.createRef();
    this.css3DContainerRef = React.createRef();
    this.worldData = null;
  }

  someFunction = () => {
    console.log("called some function")
  }
  setWorldData = (data) => {
    this.worldData = cloneObject(data);
    this.initWorld();
  }
  initWorld = () => {
    const { scenes } = this.worldData;
    let currentScene = { ...scenes[0] };

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

    this.textureLoaderSilent = new TextureLoader();
    this.textureLoaderSilent.load(currentScene.background.mediumPath, (texture) => {
      updateSphereTexture(texture);
    });

    const scene = new Scene();
    const raycaster = new Raycaster();
    const camera = new PerspectiveCamera(70, 2, 0.001, 10000);
    camera.position.set(0, 0, .0001);
    const initialCameraPosition = camera.quaternion.clone();
    camera.position.z = 10;
    const renderer = new WebGLRenderer({ antialias: true });
    const canvas = renderer.domElement;
    // const canvas = props.canvasRef;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    scene.add(mesh)


    ///rednderer    
    renderer.setClearColor("#0000");
    canvas.current = renderer.domElement;
    this.myRef.current.appendChild(canvas.current);
    this.css3DRenderer = new CSS3DRenderer();
    this.myRef.current.appendChild(this.css3DRenderer.domElement);
    ///rednderer    

    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    function render(time) {
      const fps = 1 / 60;
      time += fps;
      renderer.render(scene, camera);
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      controls && controls.update();
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);


    ///Controls
    const controls = new OrbitControls(camera, this.myRef.current);
    // controls.enabled = false;
    controls.enableDamping = true;
    controls.dampingFactor = this.isMobile ? 0.15 : 0.25;
    controls.rotateSpeed = this.isMobile ? 1 : 0.25;
    controls.enablePan = false;
    controls.enableZoom = (!this.editMode || this.isMobile) ? true : false;

    controls.rotateSpeed *= -1;


    const _addElementsToScene = (objects) => {
      objects.forEach(item => {
        const { id, x, y, z } = item;
        if (item.type === "sceneChange" || item.type === "guestSeat") {
          let obj = new VRChairObject(0, camera, mesh.material.map, null);
          scene.add(obj);
          obj.setPosition(x, y, z);
          obj.setAxisRotations();
          obj.setId(id);
          obj.showOrUpdateMood(2)
          return item;
        }
      })
    }
    _addElementsToScene(currentScene.objects);

    // MOUSE MOVE EVENT
    document.addEventListener("mousemove", (event) => {
      // if (this.controlsActive) {
      let intersect = _ray_tracing(event, scene.children, raycaster, camera, canvas);

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

    const _editModeControls = () => {
      // DRAG OBJECTS
      const dragControls = new DragControls(scene.children, camera, renderer.domElement);
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


  }
  componentDidMount() {
    console.log(this.css3DContainerRef)
    console.log(this.myRef)
  }


  render() {
    return <div>
      <div className="" ref={this.css3DContainerRef} />
      <div className="" ref={this.myRef} />
    </div>
  }
}