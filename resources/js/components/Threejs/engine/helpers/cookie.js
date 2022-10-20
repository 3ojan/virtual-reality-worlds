export function getCookie(name) {
    const cookies = document.cookie.split(';')
        .reduce((acc, cookieString) => {
            const [key, value] = cookieString.split('=').map(s => s.trim());
            if (key && value) {
                acc[key] = decodeURIComponent(value);
            }
            return acc;
        }, {});
    return name ? cookies[name] || '' : cookies;
 }
 
 
 export function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  
 }