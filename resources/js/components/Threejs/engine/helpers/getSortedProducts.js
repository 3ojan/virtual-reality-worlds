import $ from 'jquery';

const addNewProduct = (num) => {
    if(num == 11){
        alert('Only 10 products allowed!');
        return;
    }
    console.log('addNewProduct ', num);
    let prod = `<form class="product-container" data-order="${num}">
    <div class="product-num">${num}.</div>
    <div class="fields">
        <div class="field">
            <label class="label">Product name <i>(Required)</i></label>
            <div class="control">
                <input class="input is-small" type="text" placeholder="Product name" value="Product name" name="product_name">
            </div>
        </div>
    
        <div class="field">
            <div class='uploadThumbnailWrapper'>
                <div class="flx-sb">
                    <span class="lbl">Product image</span>
                    <label class="upload_image_label">Upload image</label>
                </div>
                <div  class='upload_product_image uploadzone' title='Product image'>
                    <img class="default_image" src="./textures/banner_placeholder_ratio2_1.jpg">
                    <span class='material-icons-outlined upload-thumb-removal' title="Delete product image">delete</span>
                </div>
                <div class="info-bubble">
                    <span class="small-txt"><span class="material-icons">info</span>Ratio: 2:1 Maximum Size: 1600x800</span>
                </div>
                <input type="hidden" name="product_image" value="./textures/banner_placeholder.png">
                <input type="hidden" name="product_image_aspect_ratio" value="1">
            </div>
         
        </div>                                
    
        <div class="field">
            <label class="label">Product description</label>
            <div class="control prod-desc">
                <textarea class="textarea is-small" rows="4" placeholder="Product description" name="product_description" id="product_description${num}"></textarea>
            </div>
        </div>
    
        <div class="field">
            <label class="label">Price</label>
            <div class="control">
            <input class="input is-small" type="text" placeholder="Price" name="product_price">
            </div>
        </div>
    
        <div class="field">
            <label class="label">Product URL</label>
            <div class="control">
                <input class="input is-small" type="text" placeholder="https://example.com" name="product_url">
            </div>
        </div>

        <div class="field">
            <label class="label">Button Label</label>
            <div class="control">
                <input class="input is-small" type="text" placeholder="BUY ITEM" name="product_button_label">
            </div>
        </div>
        
    </div>
    <div class="product-delete"><button class="delete button is-danger"></button></div>
    </form>`;

    return prod;
}

const getSortedProducts = (selector, attrName) =>{
    //getSortedProducts(selector, attrName) {
    return $($(selector).toArray().sort(function(a, b){
        var aVal = parseInt(a.getAttribute(attrName)),
            bVal = parseInt(b.getAttribute(attrName));

        // console.log('aVal - bVal',aVal - bVal);
        return aVal - bVal;
    }));
     
}

const updateDataOrder = (array) =>{

    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        const order = index+1;
        $(element).attr('data-order', order);
        // console.log($(element));
        // console.log($(element).find('.product-num'));
        $(element).find('.product-num').text(order + '.');
        
    }
     
}

const emptyProductValues = (item) =>{

    $(item).find('.input').val('');
    $(item).find('.textarea').val('');
    $(item).find('.input [name=product_image]').val('./textures/banner_placeholder.png');
    $(item).find('.upload_product_image .default_image').attr('src','./textures/banner_placeholder.png');
    $(item).find('.input [name=product_image_aspect_ratio]').val(1);

}

const getProductsData = (form) =>{

    var unindexed_array = form.serializeArray();

    var indexed_array = {};
    
    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });
    
    return indexed_array;
     
}

const validateFormData = (form) => {

    const arr = [];
    arr.push(...form.children);

    // tinymce.get("info-element-description1").getContent()

    let products = {};
    let pairs;
    let result = true;
    for (var i=0; i < arr.length; i++) {
        let el = $(arr[i]);
        let order = el.attr('data-order');
        let formData = new FormData(arr[i]);
        pairs = {};
        for (const [name, value] of formData) {
            if(name == 'product_name' && value == ''){
                $(arr[i]).find("[name="+name+"]").css('background', '#ff00003b');
                return false;
            }
            if(name == 'product_url' && value == ''){
                $(arr[i]).find("[name="+name+"]").css('background', '#ff00003b');
                return false;
            }
        }

        // products[i] = pairs;
    }

    return true;

}

const getFormData = (form) => {

    const arr = [];
    arr.push(...form.children);

    // console.log('arr',arr);
    // console.log('arr.length',arr.length);

    let products = [];
    let pairs;
    for (var i=0; i < arr.length; i++) {
        let formData = new FormData(arr[i]);
        pairs = {};
        for (const [name, value] of formData) {
            console.log(name + ': '+ value);
            let val = value; 
            if(name === 'product_description'){
                let num = i + 1;
                let decsValue = tinymce.get("product_description"+num).getContent();
                console.log('desc Value',decsValue);
                val = decsValue;
            }

            pairs[name] = val;
        }

        products[i] = pairs;
    }

    return products;

}

const getRandomProduct = (products) => {
    if(products){
        var oneRandomProduct = products[Math.floor(Math.random()*products.length)];
        return oneRandomProduct;
    }

    return false;

}

const createProductListForEdit = (products) => {

    // $el = $('<div>');
    console.log('createProductListForEdit', products);

    let total = Object.entries(products).length;
    console.log('total',total);

    // for (let i = 0; i < products.length; i++) {
        // let num = i+1;
        // if(i > 0){
        //     $('#add_more_products').trigger('click');
        // }
    for (let i = 0; i < total; i++) {
        // let num = i;
        if(i > 0){
            $('#add_more_products').trigger('click');
        }
        let num = i+1;
        const product = products[i];
        console.log('product',product);
        $(".product-container[data-order="+num+"] input[name=product_name]").val(product.product_name);
        $(".product-container[data-order="+num+"] textarea[name=product_description]").val(product.product_description);
        $(".product-container[data-order="+num+"] .upload_product_image .default_image").attr('src', product.product_image);
        $(".product-container[data-order="+num+"] input[name=product_price]").val(product.product_price);
        $(".product-container[data-order="+num+"] input[name=product_url]").val(product.product_url);
            
    }


}

export { addNewProduct, getSortedProducts, updateDataOrder, getProductsData, emptyProductValues, getFormData, validateFormData, getRandomProduct, createProductListForEdit };