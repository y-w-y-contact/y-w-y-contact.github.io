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

function ywy_get_file_parameter() {
    return new Promise(function (resolve, reject) {
        let this_url_string = window.location.href;
        let this_url = new URL(this_url_string);
        let this_parameter = this_url.searchParams.get("file");
        resolve(this_parameter.replace(/ /g, "+"));
    });
}

function ywy_format_bytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function ywy_quality_to_text(this_quality) {
    return new Promise(function (resolve, reject) {
        let this_quality_text = "";
        switch (this_quality) {
            case "120":
                this_quality_text = "4K";
                break;
            case "116":
                this_quality_text = "1080P60";
                break;
            case "112":
                this_quality_text = "1080P+";
                break;
            case "80":
                this_quality_text = "1080P";
                break;
            case "74":
                this_quality_text = "720P60";
                break;
            case "64":
                this_quality_text = "720P";
                break;
            case "32":
                this_quality_text = "480P";
                break;
            case "16":
                this_quality_text = "360P";
                break;

            default:
                this_quality_text = "自動最高畫質";
                break;
        }
        resolve(this_quality_text);
    });
}


/*函數庫結束*/

async function ywy_console() {
    let ywy_has_file_parameter = await ywy_detect_file_parameter();
    if (!ywy_has_file_parameter) {
        alert("無法獲取檔案訊息，請透過正確的方式開啟下載網頁。");
    } else {
        let ywy_file_parameter = await ywy_get_file_parameter();
        let ywy_file_string = ywy_base64_decode(ywy_file_parameter);
        let ywy_file_json = JSON.parse(ywy_file_string);
        if (ywy_file_json.type == "bangumi") {

        } else if (ywy_file_json.type == "video") {
            //填入基本訊息開始//
            document.getElementById("ywy_image_box").src = ywy_file_json.picture;
            document.getElementById("ywy_media_title_mother").innerText = `名稱: ${ywy_file_json.title_mother}`;

            let ywy_title_child_fix = "";
            if (ywy_file_json.epsiode > 1) {
                ywy_title_child_fix = `第${ywy_file_json.epsiode + 1}集-${ywy_file_json.title_child}`;
            }else{
                ywy_title_child_fix = ywy_file_json.title_child;
            }
            document.getElementById("ywy_media_title_child").innerText = `集數: ${ywy_title_child_fix}`;
            
            document.getElementById("ywy_media_quality").innerText = `畫質: ${await ywy_quality_to_text(ywy_file_json.quality)} (若影片經過後製，可能會判斷不準確)`;
            document.getElementById("ywy_media_url").innerText = `原始網址: ${ywy_file_json.url}`;
            document.getElementById("ywy_media_picture").innerText = `封面圖片: ${ywy_file_json.picture}`;

            let ywy_file_size_sum = 0;
            for (let i = 0; i < ywy_file_json.download_info.media_download_data.data.durl.length; i++) {
                ywy_file_size_sum += ywy_file_json.download_info.media_download_data.data.durl[i].size;
            }
            document.getElementById("ywy_media_size").innerText = `檔案大小: ${ywy_format_bytes(ywy_file_size_sum)}`;
            //填入基本訊息結束//

        } else if (ywy_file_json.type == "audio") {

        }
    }
}

/*開關開始*/
ywy_console();
/*開關結束*/