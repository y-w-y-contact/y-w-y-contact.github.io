/*函數庫開始*/
function ywy_base64_decode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
}

function ywy_detect_file_parameter() {
    return new Promise(function (resolve, reject) {
        let this_url_string = window.location.href;
        let this_url = new URL(this_url_string);
        let this_search = this_url.searchParams.has("file");
        resolve(this_search);
    });
}
/*函數庫結束*/

async function ywy_console() {
    let ywy_has_file_parameter = await ywy_detect_file_parameter();
    if(!ywy_has_file_parameter){
        alert("無法獲取檔案訊息，請透過正確的方式開啟下載網頁。");
    }else{
        let ywy_file_parameter = new URL(window.location.href).searchParams.get("file");
        let ywy_file_string = ywy_base64_decode(ywy_file_parameter);
        let ywy_file_json = JSON.parse(ywy_file_string);
        
        document.getElementById("ywy_image_box").src = ywy_file_json.picture;
    }
}  

/*開關開始*/
ywy_console();
/*開關結束*/