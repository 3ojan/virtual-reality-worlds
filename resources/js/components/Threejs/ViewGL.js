import React, { useEffect, useState, useRef } from 'react';
import * as THREE from "three";

function ViewGL(props) {

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

  useEffect(() => {
    if (!didMountRef.current) {
      var w = 800
      var h = 700
      var curF = 0;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 100, 1, 1000);
      camera.position.z = 10;
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      const canvas = renderer.domElement;
      // const canvas = props.canvasRef;
      canvas.style.width = "100%";
      canvas.style.height = "100%";

      const geometry = new THREE.SphereGeometry(3);
      // const m = new THREE.MeshBasicMaterial({ color: "FF0000" });
      const m = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }) //)
      const mesh = new THREE.Mesh(geometry, m);
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
        const fps = 1 / 60;
        time += fps;
        mesh.rotation.y++;
        mesh.scale.x * Math.sin() * time;
        mesh.scale.y * Math.sin() * time;
        mesh.scale.z * Math.sin() * time;
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