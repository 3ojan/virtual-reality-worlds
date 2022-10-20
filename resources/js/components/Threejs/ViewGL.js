import React, { useEffect, useState, useRef, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setWidth } from '../../redux/user/sphere';
import * as THREE from "three";
import ThreeJSValuesContext from '../../context/thingsContext';

function ViewGL(props) {

  const sphere = useContext(ThreeJSValuesContext);
  console.log(sphere);

  let geometry = new THREE.SphereGeometry(sphere.radius, 64, 64);
  let mesh;
  let mount = null;

  const didMountRef = useRef(false);
  // ******************* PUBLIC EVENTS ******************* //
  const updateValue = (value) => {
    // Whatever you need to do with React props
  };

  const onMouseMove = () => {
    // Mouse moves
  };

  const onWindowResize = (vpW, vpH) => {
    this.renderer.setSize(vpW, vpH);
  }

  const changeState = () => {
    settestState(!testState)
  }

  useEffect(() => {
    if (!didMountRef.current) {

      let onChangeState = changeState;

      var w = 800
      var h = 700
      var curF = 0;


      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(70, 2, 0.001, 10000);
      camera.position.set(0, 0, .0001);
      const initialCameraPosition = camera.quaternion.clone();
      camera.position.z = 10;
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      const canvas = renderer.domElement;
      // const canvas = props.canvasRef;
      canvas.style.width = "100%";
      canvas.style.height = "100%";


      const material = new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
      });

      // const m = new THREE.MeshBasicMaterial({ color: "FF0000" });
      const m = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }) //)
      mesh = new THREE.Mesh(geometry, m);
      scene.add(mesh)

      // camera.position.z = 1.9;
      renderer.setClearColor("#0000");
      // renderer.setSize(w, h);

      canvas.current = renderer.domElement;
      mount.appendChild(canvas.current);
      didMountRef.current = true;

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
        console.log(sphere.radius)
        mesh.scale.x = sphere.radius;
        mesh.scale.y = sphere.radius;
        mesh.scale.z = sphere.radius;
        geometry = new THREE.SphereGeometry(sphere.radius, 64, 64);
        const fps = 1 / 60;
        time += fps;
        // mesh.rotation.y += Math.sin() * time;
        mesh.rotation.y = Math.sin(time) * 2;
        renderer.render(scene, camera);
        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        }
        requestAnimationFrame(render);
      };

      requestAnimationFrame(render);
    }
  }, []);

  return (
    <div className="absolute top-0 w-full h-full bg-center bg-cover" ref={ref => (mount = ref)} />
  );

}
export default ViewGL