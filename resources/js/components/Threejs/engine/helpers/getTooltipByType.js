export default function(type){
    let tooltip = '';

    switch (type) {
        case 'guestSeat': tooltip = 'Take a seat'; break;
        case 'screenStream': tooltip = 'Share your screen'; break;
        case 'webLink': tooltip = 'Open link'; break;
        case 'sceneChange': tooltip = 'Change scene'; break;
        case 'payPalDonation': tooltip = 'Make a donation'; break;
        case 'chessGame': tooltip = 'Play chess'; break;
        case 'infoElement': tooltip = 'Info element'; break;
        case 'shopLink': tooltip = 'Shop'; break;
        case 'embeddedWebpage': tooltip = 'Embedded webpage'; break;

        // Without indicator
        // case 'baglessRoom': tooltip = 'Enter new world'; break;
        // case 'youtube': tooltip = 'Play video'; break;
    }

    return tooltip;
}