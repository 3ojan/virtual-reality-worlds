import { Vector3 } from 'three'

export const _ray_tracing = (e, objects, raycaster, camera, webglCanvas) => {
  const uv = new Vector3();
  if (e.offsetX) {  //chrome,ie,safari
    uv.x = e.offsetX;
    uv.y = e.offsetY;
  } else { //firefox
    uv.x = e.layerX;
    uv.y = e.layerY;
  }
  uv.x = 2 * (uv.x / webglCanvas.clientWidth) - 1;
  uv.y = 1 - 2 * (uv.y / webglCanvas.clientHeight);
  const cam = camera.clone();
  raycaster.setFromCamera(uv, cam);
  return raycaster.intersectObjects(objects);
}

export const getStringifiedWorldData = (worldData, scenes) => {
  const wd = { ...worldData };
  wd.version = 3;
  wd.scenes = scenes;
  const data = JSON.stringify(wd);
  return data;
}

export const updateJSON = (obj, jsonObj = null, sceneObjects) => {
  let pos = new Vector3();
  obj.getWorldPosition(pos);

  const scale = obj.scale;
  const { distance } = obj.parent.getLimits();
  const rot = obj.parent.getAxisRotations('radians');

  let found = false;

  if (jsonObj === null) {
    for (let x = 0; x < sceneObjects.length; x++) {

      if (obj.parent.getId() === sceneObjects[x].id) {
        sceneObjects[x].x = pos.x;
        sceneObjects[x].y = pos.y;
        sceneObjects[x].z = pos.z;
        sceneObjects[x].scale = scale.x;
        sceneObjects[x].distance = distance;
        sceneObjects[x].rotateX = rot.rotateX;
        sceneObjects[x].rotateY = rot.rotateY;
        found = true;
      }
    }
  }

  if (!found) {
    jsonObj.x = pos.x;
    jsonObj.y = pos.y;
    jsonObj.z = pos.z;
    jsonObj.scale = scale.x;
    sceneObjects.push(jsonObj);
  }
  // return sceneObjects;
}

export const cloneObject = (obj) => {
  return JSON.parse(JSON.stringify(obj));
}