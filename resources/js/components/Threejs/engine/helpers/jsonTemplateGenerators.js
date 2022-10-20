import getTooltipByType from "./getTooltipByType";

const generate_template = (type, props) => {
    let template = {};

    const tooltip = getTooltipByType(type);

    switch (type) {
        case 'guestSeat':
            template = {
                "id": props.unique_id,
                "type": "guestSeat",
                "name": "Gast Sitzplatz",
                "x": 0,
                "y": 0,
                "z": 0,
                "rotateX": 0,
                "rotateY": 0,
                "distance": props.defaultDistance,
                "scale": 1,
                "profile": {},
                tooltip
            }
            break;

        case 'screenStream':
            template = {
                "id": props.unique_id,
                "type": "screenStream",
                "name": "screenStream",
                "x": 0,
                "y": 0,
                "z": 0,
                "rotateX": 0,
                "rotateY": 0,
                "distance": 530,
                "scale": 1,
                "whoCanStream": props.whoCanStream,
                tooltip
            }
            break;

        case 'profile':
            template = {
                "id": props.unique_id,
                "type": "profile",
                "name": "Profile",
                "x": 0,
                "y": 0,
                "z": 0,
                "rotateX": 0,
                "rotateY": 0,
                "distance": props.defaultDistance,
                "scale": 1,
                "profile": {
                    "userId": props.userId,
                    "wpId": props.wpId,
                    "avatarImage": {
                        "type": "image",
                        "mediumPath": props.avatarURL
                    },
                    "name": "",
                    "email": "",
                    "dynamicProfileAvatar": props.dynamicProfileAvatar
                },
                tooltip
            }
            break;

        case 'sceneChange':
            template = {
                "id": props.unique_id,
                "type": "sceneChange",
                "name": "Szenenwechsel",
                "x": 0,
                "y": 0,
                "z": 0,
                "rotateX": 0,
                "rotateY": 0,
                "distance": props.defaultDistance,
                "scale": 1,
                "goToSceneId": props.targetSceneId, //"0000-0000-0000-0000-0000" => this static id will cause problems for chat and webrtc rooms
                "transition": "rotateAndFlow",
                "image": {
                    "url": props.imageSrc,
                    "aspectRatio": props.aspectRatio
                },
                tooltip
            }
            break;

        case 'webLink':
            template = {
                "id": props.unique_id,
                "type": "webLink",
                "name": "Link",
                "x": 0,
                "y": 0,
                "z": 0,
                "rotateX": 0,
                "rotateY": 0,
                "distance": props.defaultDistance,
                "scale": 1,
                "url": props.linkPath,
                "image": {
                    "url": props.imageSrc,
                    "aspectRatio": props.aspectRatio
                },
                "openNewWindow": props.openNewWindow,
                tooltip
            }
            break;

        case 'baglessRoom':
            template = {
                "id": props.unique_id,
                "type": "baglessRoom",
                "name": "baglessRoom",
                "x": 0,
                "y": 0,
                "z": 0,
                "rotateX": 0,
                "rotateY": 0,
                "distance": props.defaultDistance,
                "scale": 1,
                "url": props.linkPath,
                "image": {
                    "url": props.imageSrc,
                    "aspectRatio": props.aspectRatio
                },
                "openNewWindow": props.openNewWindow,
                "roomId": props.roomId,
                "roomName": props.roomName,
                tooltip
            }
            break;

        case 'shopLink':
            template = {
                "id": props.unique_id,
                "type": "shopLink",
                "name": "Products",
                "x": 0,
                "y": 0,
                "z": 0,
                "rotateX": 0,
                "rotateY": 0,
                "distance": props.defaultDistance,
                "scale": 1,
                "products": props.productsData,
                tooltip

                // "products": {
                //     data: props.productsData
                // }

            }
            break;

        case 'youtube':
            template = {
                "id": props.unique_id,
                "type": "youtube",
                "name": "youtube",
                "x": 0,
                "y": 0,
                "z": 0,
                "rotateX": 0,
                "rotateY": 0,
                "distance": 530,
                "scale": 1,
                "video_id": props.yt_id,
                tooltip
            }
            break;

        case 'room':
            template = {
                "id": props.unique_id,
                "publicName": props.publicName,
                "startPositionX": null,
                "startPositionY": null,
                "background": {
                    "type": "image",
                    "mediumPath": props.imgSrc,
                    "sliceImage": true,
                    "rotationY": 0
                },
                "objects": [],
                "ambientAudio": {
                    "type": "audio"
                },
                "introAudio": {
                    "type": "audio"
                },
                "sceneRotationY": 0,
                "backgroundRotationX": 0,
                "backgroundRotationY": "0",
                "backgroundRotationZ": 0,
                "autorotateAfterSeconds": 0,
                "autorotateSpeed": 0.1,
                "actionIfBackgroundVideoEnds": "stop",
                "goToSceneIdAfterBackgroundVideoEnds": "",
                "weather": null,
                "publicStage": false,
                "locationWithPayment": {
                    "state": false,
                    "price": 0,
                    "duration": {"untilDate": "", "days": ""},
                    "email": "",
                    "description": ''
                }
            }
            break;

        case 'chessGame':
            template = {
                "id": props.unique_id,
                "type": "chessGame",
                "name": "chessGame",
                "x": 0,
                "y": 0,
                "z": 0,
                "rotateX": 0,
                "rotateY": 0,
                "distance": props.defaultDistance,
                "scale": 1,
                tooltip
            }
            break;

        case 'payPalDonation':
            template = {
                "id": props.unique_id,
                "type": "payPalDonation",
                "name": "payPalDonation",
                "x": 0,
                "y": 0,
                "z": 0,
                "rotateX": 0,
                "rotateY": 0,
                "distance": props.defaultDistance,
                "scale": 1,
                "donationURL": props.donationURL,
                "donationDescription": props.donationDescription,
                "image": {
                    "url": props.imageSrc,
                    "aspectRatio": props.aspectRatio
                },
                tooltip
            }
            break;

        case 'infoElement':
            template = {
                "id": props.unique_id,
                "type": "infoElement",
                "name": "infoElement",
                "x": 0,
                "y": 0,
                "z": 0,
                "rotateX": 0,
                "rotateY": 0,
                "distance": props.defaultDistance,
                "scale": 1,
                "layout": props.layout,
                "data": props.data,
                tooltip
            }
            break;

        case 'embeddedWebpage':
            template = {
                "id": props.unique_id,
                "type": "embeddedWebpage",
                "name": "embeddedWebpage",
                "x": 0,
                "y": 0,
                "z": 0,
                "rotateX": 0,
                "rotateY": 0,
                "distance": props.defaultDistance,
                "scale": 1,
                "iframe": props.iframe,
                "image": props.image,
                tooltip
            }
            break;
    }

    return template;
}

export default generate_template;