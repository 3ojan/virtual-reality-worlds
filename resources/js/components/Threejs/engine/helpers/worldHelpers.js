
import { Vector3, Quaternion, Object3D, LoadingManager } from "three";
// import { gsap, Back, Quad } from 'gsap';
// import $ from 'jquery';

const vector3 = new Vector3();
// obj - your object (THREE.Object3D or derived)
// point - the point of rotation (THREE.Vector3)
// axis - the axis of rotation (normalized THREE.Vector3)
// theta - radian value of rotation
// pointIsWorld - boolean indicating the point is in world coordinates (default = false)
export function rotateAboutPoint(obj, point, axis, theta, pointIsWorld, camera) {
  pointIsWorld = (pointIsWorld === undefined) ? false : pointIsWorld;

  if (pointIsWorld) {
    obj.parent.localToWorld(obj.position); // compensate for world coordinate
  }
  obj.position.sub(point); // remove the offset
  obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
  obj.position.add(point); // re-add the offset

  if (pointIsWorld) {
    obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
  }
  obj.rotateOnAxis(axis, theta); // rotate the OBJECT
  obj.lookAt(camera.position);
}

//normalizes angle 0-360
export function normaliseAngle(currentAngle, degrees) {
  currentAngle += degrees;
  currentAngle = currentAngle % 360;

  if (currentAngle < 0) {
    currentAngle += 360;
  }
  return currentAngle
}

export function degrees_to_radians(degrees) {
  return degrees * (Math.PI / 180);
}

export function radians_to_degrees(radians) {
  return radians * (180 / Math.PI);
}

export function isMobile() {
  let check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

export function htmlEscaper(text) {
  if (!text) {
    return text;
  }

  const _htmlEscapeMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  }

  return String(text).replace(/[&<>"'\/]/g, function (s) {
    return _htmlEscapeMap[s];
  });
}


////to target quternion
// export function animateCamera(camera, elementSelected, onStartCallback, onEndCallBack, delay = 0) {
//   onStartCallback && onStartCallback();
//   const startOrientation = camera.quaternion.clone();

//   const targetPosition = new Vector3();
//   const targetOrientation = new Quaternion();
//   const targetScale = new Vector3();

//   const dbConfig = elementSelected.parent.dbConfig || null;

//   if (dbConfig !== null) {
//     elementSelected.rotateOnAxis(new Vector3(0, 1, 0), dbConfig.rotateY * -1 || 0);
//     elementSelected.rotateOnAxis(new Vector3(1, 0, 0), dbConfig.rotateX * -1 || 0);
//     elementSelected.lookAt(camera.position);
//   }

//   elementSelected.matrixWorld.decompose(targetPosition, targetOrientation, targetScale);
//   let cameraDirection = new Vector3();

//   if (dbConfig !== null) {
//     element.rotateOnAxis(new Vector3(1, 0, 0), dbConfig.rotateX || 0);
//     element.rotateOnAxis(new Vector3(0, 1, 0), dbConfig.rotateY || 0);
//   }

//   gsap.to({}, {
//     duration: 1,
//     delay,
//     ease: Back.easeOut,
//     onStart: () => {
//     },
//     onUpdate: function () {
//       camera.quaternion.copy(startOrientation).slerp(targetOrientation, this.ratio);
//       camera.quaternion.normalize();
//     },
//     onComplete: () => {

//       camera.getWorldDirection(cameraDirection);
//       cameraDirection.x *= -1;
//       cameraDirection.y *= -1;
//       cameraDirection.z *= -1;

//       camera.position.copy(cameraDirection);
//       onEndCallBack && onEndCallBack();
//     }
//   });
// };

// export function pointCameraToObject(camera, elementSelected, onStartCallback, onEndCallBack) {
//   onStartCallback && onStartCallback();

//   const targetPosition = new Vector3();
//   const targetOrientation = new Quaternion();
//   const targetScale = new Vector3();

//   const dbConfig = elementSelected.parent.dbConfig;

//   elementSelected.rotateOnAxis(new Vector3(0,1,0), dbConfig.rotateY * -1 || 0);
//   elementSelected.rotateOnAxis(new Vector3(1,0,0), dbConfig.rotateX * -1 || 0);
//   elementSelected.lookAt(camera.position);

//   elementSelected.matrixWorld.decompose(targetPosition, targetOrientation, targetScale);
//   let cameraDirection = new Vector3();
//   camera.quaternion.copy(targetOrientation);
//   camera.getWorldDirection(cameraDirection);
//   cameraDirection.x *= -1;
//   cameraDirection.y *= -1;
//   cameraDirection.z *= -1;

//   camera.position.copy(cameraDirection);

//   elementSelected.rotateOnAxis(new Vector3(1,0,0), dbConfig.rotateX || 0);
//   elementSelected.rotateOnAxis(new Vector3(0,1,0), dbConfig.rotateY || 0);

//   onEndCallBack && onEndCallBack();
// };

///to target position
// export function animateCameraToPosition(camera, elementSelected, onStartCallback, onEndCallBack, delay = 0) {
//   const startOrientation = camera.quaternion.clone();

//   const targetPosition = new Vector3();
//   const targetOrientation = new Quaternion();
//   const targetScale = new Vector3();

//   elementSelected.matrixWorld.decompose(targetPosition, targetOrientation, targetScale);
//   let cameraDirection = new Vector3();

//   gsap.to({}, {
//     duration: 1,
//     delay,
//     ease: Quad.easeIn,
//     onStart: () => {
//       onStartCallback && onStartCallback();
//     },
//     onUpdate: function () {
//       camera.position.lerp(targetPosition, this.ratio);
//       elementSelected.material.opacity = 1.0 - this.ratio;
//     },
//     onComplete: () => {
//       elementSelected.material.opacity = 1.0;
//       camera.getWorldDirection(cameraDirection);
//       cameraDirection.x *= -1;
//       cameraDirection.y *= -1;
//       cameraDirection.z *= -1;
//       camera.position.copy(cameraDirection);
//       onEndCallBack && onEndCallBack();
//     }
//   });
// };

// export function animateCameraOutro(camera, elementSelected, onStartCallback, onEndCallBack, delay = 0) {
//   gsap.fromTo(
//     camera,
//     { fov: 100 },
//     { fov: 70, delay, duration: .8, onUpdate: () => { camera.updateProjectionMatrix(); } }
//   );
// };


export const getSceneFromObject = (scenes, obj) => {
  let scene = {};
  Object.keys(scenes).forEach((key) => {
    if (scenes[key].objects.filter(item => item.id === obj.id).length > 0) {
      scene = scenes[key];
      return scene;
    }
  })
  return scene
}

export const getObjectFromId = (scenes, obj) => {
  const objs = [];
  scenes.map(scene => {
    objs = [...objs, ...scene.objects];
  });
  return objs.filter(item => item.id === obj.id)[0]
}
export const getObjectFromParam = (scenes, obj, param = "goToSceneId") => {
  const objs = [];
  scenes.map(scene => {
    objs = [...objs, ...scene.objects];
  });
  return objs.filter(item => item[param] === obj[param])[0]
}

export const customLoadingManager = (onLoad, onProgress, onError) => {
  onLoad = onLoad || function () { };
  onProgress = onProgress || function () { };
  onError = onError || function () { };
  const loadingManager = new LoadingManager();
  loadingManager.onLoad = onLoad;
  loadingManager.onProgress = onProgress;
  loadingManager.onProgress = onError;
  return loadingManager;
}

export const emptySelectOptions = (id) => {
  // $('#' + id).find('option').remove();
}

export const closeTinyMCEMoreMenu = () => {
  // $(".tox-tbtn").removeClass('tox-tbtn--enabled');
  // $(".tox-tbtn").attr('aria-expanded', false);
  // $(".tox-tbtn").removeAttr('aria-controls');
  // $(".tox-silver-sink").html('')
}

export const isValidUrl_old = urlString => {
  var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
  return !!urlPattern.test(urlString);
}

export const isValidUrl = urlString => {
  let url;
  try {
    url = new URL(urlString);
  }
  catch (e) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}