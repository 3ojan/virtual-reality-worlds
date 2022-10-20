export const worldData = {
  "version": 3,
  "scenes":
    [
      {
        "id": "05beefb0-5a93-4bb2-8362-067ca41c453c",
        "name": "Neue Welt - scene 2", "publicName": "Room 1",
        "startPositionX": null,
        "startPositionY": null,
        "background": { "type": "image", "mediumPath": "virtualRealityFiles/1c3d6ccdaeb5313869928bb5ee6ed2e651b98bf8.jpg", "sliceImage": true, "rotationY": 0 },
        "objects":
          [
            {
              "id": "8fcfef44-b5f4-4889-88e0-c76217705956",
              "type": "guestSeat",
              "name": "Gast Sitzplatz",
              "x": -33.19233964731445,
              "y": 80.05899948798171,
              "z": -287.20857436666245,
              "rotateX": 0,
              "rotateY": 0,
              "distance": 300,
              "scale": 1,
              "profile": {}
            },
            {
              "id": "1273b031-221e-49b7-b523-7ce67430e6cd",
              "type": "sceneChange",
              "name": "Szenenwechsel",
              "x": -194.8050299786617,
              "y": 32.56729526668049,
              "z": -225.81034425826368,
              "rotateX": 0,
              "rotateY": 0,
              "distance": 300,
              "scale": 1,
              "goToSceneId": "d9922f20-dae7-40f4-9e49-06d2579b4187",
              "transition":
                "rotateAndFlow",
              "image": { "url": "", "aspectRatio": "0.9999999184349161" }
            },
            {
              "id": "4e337d58-747a-4a13-be8b-5e43182538b4",
              "type": "screenStream",
              "name": "screenStream",
              "x": -522.4067941715122,
              "y": 493.50322228809694,
              "z": -402.4921976685286,
              "rotateX": 0,
              "rotateY": 0,
              "distance": 930,
              "scale": 0.7073170731707317,
              "whoCanStream": "everyone"
            }
          ],
        "ambientAudio": { "type": "audio" },
        "introAudio": { "type": "audio" },
        "sceneRotationY": 0,
        "backgroundRotationX": 0,
        "backgroundRotationY": "0",
        "backgroundRotationZ": 0,
        "autorotateAfterSeconds": 0,
        "autorotateSpeed": 0.1,
        "actionIfBackgroundVideoEnds": "stop",
        "goToSceneIdAfterBackgroundVideoEnds": "",
        "weather": null
      },
      {
        "id": "d9922f20-dae7-40f4-9e49-06d2579b4187",
        "name": "Neue Welt - scene 2",
        "publicName": "Room 2 ",
        "startPositionX": null,
        "startPositionY": null,
        "background": { "type": "image", "mediumPath": "virtualRealityFiles/1c3d6ccdaeb5313869928bb5ee6ed2e651b98bf8.jpg", "sliceImage": true, "rotationY": 0 },
        "objects":
          [
            {
              "id": "2d47b6c0-70de-4b95-a45e-05916b741f93",
              "type": "sceneChange",
              "name": "Szenenwechsel",
              "x": 82.45814590178207,
              "y": 24.008060937339827,
              "z": -287.3488784025266,
              "distance": 300,
              "scale": 1,
              "goToSceneId": "05beefb0-5a93-4bb2-8362-067ca41c453c",
              "transition": "rotateAndFlow",
              "rotateX": 0,
              "rotateY": 0,
              "image": {
                "url": "",
                "aspectRatio": "0.9999999184349161"
              }
            }
          ],
        "ambientAudio": { "type": "audio" },
        "introAudio": { "type": "audio" },
        "sceneRotationY": 0,
        "backgroundRotationX": 0,
        "backgroundRotationY": "0",
        "backgroundRotationZ": 0,
        "autorotateAfterSeconds": 0,
        "autorotateSpeed": 0.1,
        "actionIfBackgroundVideoEnds": "stop",
        "goToSceneIdAfterBackgroundVideoEnds": "",
        "weather": null
      }
    ],
  "rules": { "visibleIf": {}, "hiddenIf": {} },
  "copyrightLogo": {},
  "previewBackgroundImage": { "type": "image", "mediumPath": "virtualRealityFiles/1c3d6ccdaeb5313869928bb5ee6ed2e651b98bf8.jpg", "transparent": false },
  "socialMediaPreviewImage": {},
  "worldAmbientAudio": {},
  "customIcons": {},
  "elementTypeIconAssignments": {},
  "creatorUserIdOfWorld": "1",
  "lat": null,
  "lng": null,
  "name": "Neue Welt",
  "worldsCanEnter":
    [
      { "id": 5, "name": "Neue Welt" },
      { "id": 7, "name": "2 seats" },
      { "id": 8, "name": "Neue Welt" },
      { "id": "1", "name": "2seats 1sceneChange" }
    ],
  "description": "",
  "publicAvailable": 1
}