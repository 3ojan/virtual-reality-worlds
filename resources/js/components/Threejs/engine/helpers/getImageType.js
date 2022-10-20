import $ from 'jquery';

const getImgThumb = (imageURL) => {
    imageURL = imageURL || "";
    if (imageURL === "") {
        return "./textures/empty.png";
    }
    const extension = imageURL.split('.');
    const ext = `.${extension[extension.length - 1]}`;
    let thumb = imageURL.replace(ext, `_thumb${ext}`);
    return thumb;
}

const getLowResImageUrl = (imageURL) => {
    const extension = imageURL.split('.');
    const ext = `.${extension[extension.length - 1]}`;
    let thumb = imageURL.replace(ext, `_lowRes${ext}`);
    return thumb;
}

const getSceneImgFromThumb = (imageURL) => {
    let img = imageURL.replace('_thumb', '');
    return img;
}

const generateImageWithThumbAndErrorCallback = (imageURL) => {
    const imageThumb = getImgThumb(imageURL);
    const element = $(`<img src="${imageThumb}" onError='this.src = this.src.includes("_thumb") ? "${imageThumb.replace('_thumb.', '.')}" : "./textures/empty.png"'  class="chat-img-dynamic"/>`);
    return element;
}

const generateImageWithThumbNormalCallbackAndCustomErrorCallback = (imageURL, def = "./textures/empty.png", id) => {
    const imageThumb = getImgThumb(imageURL);
    const element = $(`<img src="${imageThumb}" onError='this.src = this.src.includes("_thumb") ? "${imageThumb.replace('_thumb.', '.')}" : ${def}'   class="chat-img-dynamic-${id}" />`);
    return element;
}

const generateImageWithNoCallback = (imageURL, id) => {
    const element = $(`<img src="${imageURL}"   class="chat-img-dynamic-${id}" />`);
    return element;
}

const thumbImageWithNormalCallback = (imageURL) => {
    const imageThumb = getImgThumb(imageURL);
    const element = $(`<img src="${imageThumb}" onerror="this.onerror=null;this.src='${imageURL}';" />`);
    return element;
}

export { getImgThumb, getSceneImgFromThumb, getLowResImageUrl, generateImageWithNoCallback, generateImageWithThumbAndErrorCallback, generateImageWithThumbNormalCallbackAndCustomErrorCallback, thumbImageWithNormalCallback };