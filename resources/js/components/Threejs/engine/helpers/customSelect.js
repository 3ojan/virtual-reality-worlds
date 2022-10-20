export default class CustomSelect{
    constructor(model){

        this.model = model;

        this.generateCustomSelect(this.closeAllSelect);

        /* If the user clicks anywhere outside the select box, then close all select boxes: */
        document.addEventListener("click", this.closeAllSelect);
    }

    generateCustomSelect = (closeAllSelect) =>{
        let x, i, j, l, ll, selElmnt, a, b, c;
        /* Look for any elements with the class "custom-select": */
        x = document.getElementsByClassName("custom-select");
        l = x.length;

        for (i = 0; i < l; i++) {
            selElmnt = x[i].getElementsByTagName("select")[0];
            ll = selElmnt.length;
            /* For each element, create a new DIV that will act as the selected item: */
            a = document.createElement("DIV");
            a.setAttribute("class", "select-selected");
            if(selElmnt.selectedIndex < 0){
                a.innerHTML = '';
            }else{
                let selEl = selElmnt.options[selElmnt.selectedIndex];
                let selElmntVal = selEl.value;
                a.innerHTML = selEl.innerHTML;
                a.setAttribute("device-id", selElmntVal);
                selElmnt.options[selElmnt.selectedIndex].setAttribute('selected','selected');
                selElmnt.id === 'change_language' && selElmntVal && a.setAttribute("data-lang", selElmntVal);
                selEl.hasAttribute('data-lang') && a.setAttribute("data-lang", selEl.dataset.lang);
            }
            //a.innerHTML = selElmnt.selectedIndex < 0 ? '':  selElmnt.options[selElmnt.selectedIndex].innerHTML;
            x[i].appendChild(a);
            /* For each element, create a new DIV that will contain the option list: */
            b = document.createElement("DIV");
            b.setAttribute("class", "select-items select-hide");

            for (j = 0; j < ll; j++) {
                /* For each option in the original select element, create a new DIV that will act as an option item: */
                c = document.createElement("DIV");
                let selElmntVal = selElmnt.options[j].value;
                c.setAttribute("device-id", selElmntVal);
                selElmnt.id === 'change_language' && selElmntVal && c.setAttribute("data-lang", selElmntVal);
                c.innerHTML = selElmnt.options[j].innerHTML;
                selElmnt.options[j].hasAttribute('data-lang') && c.setAttribute("data-lang", selElmnt.options[j].dataset.lang);

                c.addEventListener("click", function(e) {
                    /* When an item is clicked, update the original select box, and the selected item: */
                    let y, i, k, s, h, sl, yl;
                    s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                    sl = s.length;
                    h = this.parentNode.previousSibling;
                    
                    // console.log('c',c);//just sound
                    //console.log('selElmnt.options[j]',selElmnt.options[j]);

                    for (i = 0; i < sl; i++) {
                        // s[i].removeAttribute('selected');
                        if (s.options[i].value == this.getAttribute('device-id')) {
                        // if (s.options[i].innerHTML == this.innerHTML) {
                            s.selectedIndex = i;
                            h.innerHTML = this.innerHTML;
                            // console.log('device name:',h.innerHTML);
                            y = this.parentNode.getElementsByClassName("same-as-selected");
                            yl = y.length;
                            for (k = 0; k < yl; k++) {
                                y[k].removeAttribute("class");
                                
                            }
                            this.setAttribute("class", "same-as-selected");
                            // s[i].setAttribute('selected','selected');
                            // break;
                        }
                        // else{
                        //     // s[i].removeAttribute('selected');
                        // }
                    }
                    h.click();
                    
                    if(s.classList.contains('cameraSelect')){
                        let camId = s.id;
                        document.getElementById(camId).dispatchEvent(new Event('change'));
                    }
                    if(s.classList.contains('microphoneSelect')){
                        let micId = s.id;
                        document.getElementById(micId).dispatchEvent(new Event('change'));
                    }
                    if(s.classList.contains('speakerSelect')){
                        let speakerId = s.id;
                        document.getElementById(speakerId).dispatchEvent(new Event('change'));
                    }

                    s.classList.contains('dispatchChange') && s.dispatchEvent(new Event('change'));
                });
                b.appendChild(c);
            }
            x[i].appendChild(b);

            a.addEventListener("click", function(e) {
                /* When the select box is clicked, close any other select boxes, and open/close the current select box: */
                e.stopPropagation();
                closeAllSelect(this);
                this.nextSibling.classList.toggle("select-hide");
                this.classList.toggle("select-arrow-active");
                // console.log('a',a);
            });


        }
    }

    closeAllSelect = (elmnt) => {
        /* A function that will close all select boxes in the document, except the current select box: */
        let x, y, i, xl, yl, arrNo = [];
        x = document.getElementsByClassName("select-items");
        y = document.getElementsByClassName("select-selected");
        xl = x.length;
        yl = y.length;
        for (i = 0; i < yl; i++) {
          if (elmnt == y[i]) {
            arrNo.push(i)
          } else {
            y[i].classList.remove("select-arrow-active");
          }
        }
        for (i = 0; i < xl; i++) {
          if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
          }
        }
    }

    refresh = () => {
        $("#change_language").length && this.changeLanguageOptionsInnerText();
        $(".select-selected").remove();
        $(".select-items").remove();
        this.generateCustomSelect(this.closeAllSelect);
    }

    changeLanguageOptionsInnerText = () =>{
        $('#change_language option').each((i,el)=>{
            const $this = $(el);
            const dataLang = $this.val();
            $this.text(this.model.languageObject[dataLang].text);    
         });
    }

}