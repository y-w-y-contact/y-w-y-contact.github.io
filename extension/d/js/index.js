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

function ywy_golden_message() {
    let this_message = ["觀看影片時，應與螢幕保持適當距離", "每觀看影片30分鐘，應至少讓眼睛休息5分鐘", "觀看影片時，應保持室內光線充足", "雖然影片很好看，但不應當沉迷", "抽菸是一種花錢來傷害身體的愚蠢行為", "影片內容多為虛構，請勿與現實混淆", "觀看暴力及情色影片，將有害身心健康", "請勿因生活不順遂，而躲進影片的虛假空間", "心情不好時，不妨唸句「阿彌陀佛 」", "如果認為影片中的主角很厲害，請好好充實自己", "文字是最基本的工具，應當好好學習", "熬夜很傷身體，請不要熬夜觀看影片", "喜歡羅莉是一種病，你該接受心理治療", "多到戶外走走，將會有意想不到的收穫", "金錢買不到時間，請勿虛度光陰", "影片與電腦都是虛擬的，只有人生才是現實的", "多與人交際相處，人生將會是充實的", "適當的運動及曬太陽，將有益身體健康", "勿以善小而不為，勿以惡小而為之", "即便暫時找不到人生的方向，也不要放棄自己", "抽菸喝酒吃檳榔，傷身傷神又傷錢", "人生沒有那麼容易，失敗是很正常的", "如果你喜歡幼女，請趕快去看心理醫生", "避免說髒話，提升自我素養", "開玩笑前，請先考慮是否會傷害到別人", "人生就那麼一次，請好好陪伴家人", "你必須專精一件事，但你也需要了解許多事", "如果累了，就休息吧，明天會更好", "如果你在學校被霸凌，請趕快告訴家長", "如果你在家中被欺負，請告訴學校老師", "如果你有多餘的能力，請幫助需要的人", "不要怕事情多，那都將成為你的經驗", "當有人摸魚時，你該慶幸，你學會的比他還多", "如果你不希望動物遭到殺害，你可以試著吃素食", "當你受傷感到痛楚時，你該想想被你吃掉的動物", "己所不欲，勿施於人", "每天做一件好事，請從微笑開始", "讓座給老人或需要的人，是一種美德", "計較的越多，失去的越多", "自殘是一種愚蠢行為，請不要這麼做", "多與朋友聊天，可以減少心理壓力", "看到別人有難時，請趕快伸出援手", "心裡有雜念時，就唸句「阿彌陀佛」吧"];
    let this_golden = this_message[Math.floor(Math.random() * this_message.length)];
    document.getElementById("ywy_golden_message").innerText = this_golden;
}

function ywy_xhr(this_url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function (e) {
            if (xhr.readyState == 4) {
                let this_blob = URL.createObjectURL(xhr.response);
                ywy_g_files.push(this_blob);
                resolve("done")
            }
        });

        xhr.addEventListener("progress", function (e) {
            ywy_g_files_recive += e.loaded;
            let this_percent = ywy_g_files_recive / ywy_g_files_size;

            document.getElementById("ywy_button_download_video").innerText = `${this_percent.toFixed(2)} %`;
        });

        xhr.onerror = function () {
            document.getElementById("ywy_button_download_video").innerText = "下載失敗";
            let this_message = `下載影片失敗\n`;
            alert("下載錯誤，請透過網頁中的問題回報按鈕向我們回報問題。");
            reject("error");
            location.reload();
        }

        xhr.responseType = "blob";
        xhr.open("get", this_url);
        xhr.send();
    });
}

async function ywy_download(ywy_file_json) {
    //取得下載列表開始//
    let ywy_download_file_list = [];
    for (let i = 0; i < ywy_file_json.download_info.media_download_data.data.durl.length; i++) {
        ywy_download_file_list.push(ywy_file_json.download_info.media_download_data.data.durl[i].url.replace("http://", "https://"));
    }
    //取得下載列表結束//

    //取得下載大小總和開始//
    for (let i = 0; i < ywy_file_json.download_info.media_download_data.data.durl.length; i++) {
        ywy_g_files_size += ywy_file_json.download_info.media_download_data.data.durl[i].size;
    }
    //取得下載大小總和結束//

    //下載檔案開始//
    for (let i = 0; i < ywy_download_file_list.length; i++) {
        window[`ywy_xhr_file_${i + 1}`] = await ywy_xhr(ywy_download_file_list[i]);
    }
    document.getElementById("ywy_button_download_video").innerText = "下載完成";
    //下載檔案結束//

    if (ywy_g_files.length > 1) {
        //blob轉file開始//
        for (let i = 0; i < ywy_g_files.length; i++) {
            ywy_g_files[i].lastModifiedDate = new Date();
            ywy_g_files[i].name = `flv_p_${i}`;
        }
        //blob轉file結束//

        //建立flv集開始//
        let this_flvs = [];
        for (let i = 0; i < ywy_g_files.length; i++) {
            this_flvs.push({
                name: ywy_g_files[i].name,
                file: ywy_g_files[i]
            });
        }
        //建立flv集結束//

        let this_merged_blob = await FLV.mergeBlobs(this_flvs.map(flv => flv.file));
        let ywy_download_link = URL.createObjectURL(this_merged_blob);

        let ywy_download_link_action = document.createElement("a");
        ywy_download_link_action.href = ywy_download_link;
        ywy_download_link.download = `${document.getElementById("ywy_media_title_mother").innerText}-${document.getElementById("ywy_media_title_child").innerText}-${document.getElementById("ywy_media_quality").innerText.split("(")[0]}.flv`;
        ywy_download_link_action.click();
    }else{
        let ywy_download_link = ywy_g_files[0];

        let ywy_download_link_action = document.createElement("a");
        ywy_download_link_action.href = ywy_download_link;
        ywy_download_link.download = `${document.getElementById("ywy_media_title_mother").innerText}-${document.getElementById("ywy_media_title_child").innerText}-${document.getElementById("ywy_media_quality").innerText.split("(")[0]}.flv`;
        ywy_download_link_action.click();
        console.log(ywy_download_link_action)
    }

}
/*函數庫結束*/

/*公用變數開始*/
var ywy_g_files = [];
var ywy_g_files_size = 0;
var ywy_g_files_recive = 0;

var ywy_g_download_clicked = false;
/*公用變數結束*/

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
            } else {
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

            //基本彈出視窗開始//
            document.getElementById("ywy_media_url").addEventListener("click", function () {
                window.open(ywy_file_json.url);
            });

            document.getElementById("ywy_media_picture").addEventListener("click", function () {
                window.open(ywy_file_json.picture);
            });

            document.getElementById("ywy_button_report").addEventListener("click", function () {
                window.open(`https://docs.google.com/forms/d/e/1FAIpQLSf-94JBqZsP51G8bHYc8RuUJOBdF2xOfo9XGWLU4bdh5IS7Ew/viewform?usp=pp_url&entry.955180954=${encodeURIComponent(ywy_file_json.url)}`);
            });

            document.getElementById("ywy_button_download_image").addEventListener("click", function () {
                window.open(ywy_file_json.picture);
            });
            //基本彈出視窗結束//

            //下載動作開始//
            document.getElementById("ywy_button_download_video").addEventListener("click", function () {
                if (ywy_g_download_clicked == false) {
                    ywy_g_download_clicked = true
                    ywy_download(ywy_file_json);
                }
            });
            //下載動作結束//
        } else if (ywy_file_json.type == "audio") {

        }
    }
}

/*開關開始*/
ywy_console();
ywy_golden_message();
/*開關結束*/