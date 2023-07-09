/*函數庫開始*/
function ywy_base64_decode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
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
function ywy_api(this_json) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function (e) {
            if (xhr.readyState == 4 && this.status == 200) {
                resolve(xhr.responseText);
            }
        });

        xhr.onerror = function () {
            resolve("err");
        };

        xhr.responseType = "text";
        xhr.open("POST", "https://extension-api.y-w-y.com/get-token");
        xhr.send(this_json);
    });
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

function ywy_xhr_by_range(this_url, this_range, this_part) {
    return new Promise(function (resolve, reject) {
        ywy_on_download = true;
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function (e) {
            if (xhr.readyState == 4) {
                let this_blob = xhr.response;
                if (typeof window[`blob_part_${this_part}`] === "undefined") {
                    window[`blob_part_${this_part}`] = [];
                }

                if (this_blob.size >= Number(this_range.split("-")[1]) - Number(this_range.split("-")[0])) {
                    window[`blob_part_${this_part}`].push(this_blob);
                    delete xhr;
                    ywy_on_download = false;
                    resolve("ok");
                } else {
                    delete this_blob;
                    ywy_on_download = false;
                    resolve("err");
                }
            }
        });

        xhr.ontimeout = function () {
            delete xhr;
            ywy_on_download = false;
            resolve("err");
        };

        xhr.onerror = function () {
            delete xhr;
            ywy_on_download = false;
            resolve("err");
        };

        xhr.responseType = "blob";
        xhr.open("get", this_url);
        xhr.setRequestHeader("Range", `bytes=${this_range}`);
        xhr.timeout = 1000 * 60;
        xhr.send();
    });
}

var ywy_on_download = false;
function ywy_download_master() {
    return new Promise(function (resolve, reject) {
        let this_total = ywy_g_downloader_mission.length;
        let this_done = 0;
        let this_timer = setInterval(async function () {
            if (ywy_g_downloader_mission.length <= 0 && ywy_on_download == false) {
                clearInterval(this_timer);
                resolve("ok");
            } else {
                if (ywy_on_download == false) {
                    let this_mission = ywy_download_file_list[ywy_g_downloader_mission[0][1]];
                    let this_range = ywy_g_downloader_mission[0][0];
                    let this_part = yywy_g_downloader_mission[0][1];
                    let this_download = await ywy_xhr_by_range(this_mission, this_range, this_part);
                    if (this_download == "ok") {
                        ywy_g_downloader_mission.shift();
                        this_done += 1;
                        document.getElementById("ywy_button_download_video").innerText = `${((this_done / this_total) * 100).toFixed(2)} %`;
                    }
                }

            }
        }, 50);
    });
}


async function ywy_download(ywy_file_json, this_player_type) {
    ywy_g_download_time_start = performance.now();
    document.getElementById("ywy_button_download_video").innerText = "準備中";
    if (this_player_type == "bangumi") {
        //取得下載列表開始//
        for (key in ywy_file_json.download_info.media_download_data_object) {
            if (String(key).indexOf("uri") !== -1) {
                ywy_g_download_file_list.push([ywy_file_json.download_info.media_download_data_object[key]], [ywy_file_json.download_info.media_download_data_object[String(key).replace("uri", "bandwidth")]]);
                ywy_g_download_file_index++;
            }
        }
        //取得下載列表結束//

        //切片開始//
        for (let i = 0; i < ywy_g_download_file_list.length; i++) {
            let this_range_going = 0;
            while (true) {
                if (ywy_g_download_file_list[i][1] <= ywy_g_downloader_limit) {
                    ywy_g_downloader_mission.push([ywy_g_download_file_list[i][1], i]);
                    break;
                } else {
                    if (this_range_going == 0) {
                        //頭
                        ywy_g_downloader_mission.push([`0-${ywy_g_downloader_limit - 1}`, i]);
                        this_range_going += ywy_g_downloader_limit;
                    } else if (this_range_going + ywy_g_downloader_limit >= ywy_g_download_file_list[i][1]) {
                        //尾
                        ywy_g_downloader_mission.push([`${this_range_going}-${ywy_g_download_file_list[i][1]}`, i]);
                        break;
                    } else {
                        //中
                        ywy_g_downloader_mission.push([`${this_range_going}-${this_range_going + ywy_g_downloader_limit - 1}`, i]);
                        this_range_going += ywy_g_downloader_limit;
                    }
                }
            }
        }
        //切片結束//

        //下載檔案開始//
        await ywy_download_master();
        document.getElementById("ywy_button_download_video").innerText = "切片下載完成";
        //下載檔案結束//

        //blob切片合併開始//
        document.getElementById("ywy_button_download_video").innerText = "合併切片";
        for (let i = 0; i < ywy_g_download_file_index; i++) {
            window[`file_${i}`] = new Blob(window[`blob_part_${i}`], { type: "video/mp4" });
        }
        //blob切片合併結束//

        //合併音訊和影片開始//
        document.getElementById("ywy_button_download_video").innerText = "重新編碼";
        if (ffmpeg === null) {
            ffmpeg = createFFmpeg({ log: true });
        }

        for (let i = 0; i < ywy_g_download_file_index; i++) {
            window[`file_${i}`] = new File([window[`file_${i}`]], `ywy_file_${i}`);
        }

        if (!ffmpeg.isLoaded()) {
            await ffmpeg.load();
        }

        for (let i = 0; i < ywy_g_download_file_index; i++) {
            ffmpeg.FS("writeFile", window[`file_${i}`].name, await fetchFile(window[`file_${i}`]));
        }

        let this_cmd = "";
        for (let i = 0; i < ywy_g_download_file_index; i++) {
            this_cmd += `-i ${window[`file_${i}`].name} `;
        }
        this_cmd += "-c copy ywy_output.mp4";
        await ffmpeg.run(...this_cmd.split(" "));
        //合併音訊和影片結束//

        //產生下載開始//
        let this_file_reader = ffmpeg.FS("readFile", "ywy_output.mp4");
        let ywy_download_link = URL.createObjectURL(new Blob([this_file_reader.buffer], { type: 'video/mp4' }));

        let ywy_download_link_action = document.createElement("a");
        ywy_download_link_action.href = ywy_download_link;
        ywy_download_link_action.download = `${document.getElementById("ywy_media_title_mother").innerText.substring(4)}-${document.getElementById("ywy_media_title_child").innerText.substring(4)}-${document.getElementById("ywy_media_quality").innerText.substring(4).split("(")[0]}.mp4`;
        document.body.append(ywy_download_link_action);
        //產生下載結束//

        //等待pre-roll開始//
        let this_preroll_timer = setInterval(function () {
            if (ywy_g_preroll_end == true) {
                clearInterval(this_preroll_timer);
                ywy_download_link_action.click();
                document.getElementById("ywy_button_download_video").innerText = "下載完成";
            } else {
                if (document.getElementById("ywy_button_download_video").innerText != "將於廣告結束後下載檔案") {
                    document.getElementById("ywy_button_download_video").innerText = "將於廣告結束後下載檔案";
                }
            }
        }, 100);
        ywy_download_success();
        //等待pre-roll結束//
    }
}
/*函數庫結束*/

/*公用變數開始*/
var ywy_g_download_video_clicked = false;
var ywy_g_download_audio_clicked = false;

var ywy_g_download_file_list = [];
var ywy_g_download_file_index = 0;

var ywy_g_downloader_mission = [];
var ywy_g_downloader_limit = Math.floor(Math.random() * (789 - 123 + 1)) + 123;

var ywy_g_files_size = 0

var ywy_g_download_time_start = 0;
var ywy_g_download_time_end = 0;
/*公用變數結束*/


async function ywy_console() {
    let ywy_has_file_parameter = await ywy_detect_file_parameter();
    if (!ywy_has_file_parameter) {
        alert("無法獲取檔案訊息，請透過正確的方式開啟下載網頁。");
    } else {
        let ywy_file_parameter = await ywy_get_file_parameter();
        let ywy_file_string = ywy_base64_decode(ywy_file_parameter);
        let ywy_file_json = JSON.parse(ywy_file_string);
        //判斷參數是否正確開始//
        if (!ywy_file_json.hasOwnProperty("msg") || !ywy_file_json.hasOwnProperty("id") || !ywy_file_json.hasOwnProperty("secret")) {
            alert("參數錯誤，請透過正確的方式開啟下載頁面。");
            throw new Error("err_parameter_invalid");
            //location.reload();
        }
        //判斷參數是否正確結束//

        //API調用開始//
        let ywy_file_api = await ywy_api(ywy_file_string);
        if (ywy_file_api == "err") {
            alert("API 伺服器忙碌中，請稍後再試。");
            throw new Error("err_api_error");
            //location.reload();
        } else {
            let ywy_file_api_parser = JSON.parse(ywy_file_api);
            if (ywy_file_api_parser.msg != "ok") {
                alert("下載連結已失效，請回到影片網頁後透過下載按鈕重新生成。");
                throw new Error("err_api_timeout");
                //location.reload();
            } else {
                ywy_file_json = JSON.parse(ywy_base64_decode(ywy_file_api_parser.key));
            }
        }
        //API調用結束//

        if (ywy_file_json.type == "bangumi") {
            //填入基本訊息開始//
            document.getElementById("ywy_image_box").src = ywy_file_json.picture;
            document.getElementById("ywy_media_title_mother").innerText = `名稱: ${ywy_file_json.title_mother}`;

            let ywy_title_child_fix = "";
            if (ywy_file_json.epsiode > 1) {
                ywy_title_child_fix = `第${ywy_file_json.epsiode}集-${ywy_file_json.title_child}`;
            } else {
                ywy_title_child_fix = ywy_file_json.title_child;
            }
            document.getElementById("ywy_media_title_child").innerText = `集數: ${ywy_title_child_fix}`;

            document.getElementById("ywy_media_quality").innerText = `畫質: ${await ywy_quality_to_text(ywy_file_json.quality)} (若影片經過後製，可能會判斷不準確)`;
            document.getElementById("ywy_media_url").innerText = `原始網址: ${ywy_file_json.url}`;
            document.getElementById("ywy_media_picture").innerText = `封面圖片: ${ywy_file_json.picture}`;

            let ywy_file_size_sum = 0;
            for (key in ywy_file_json.download_info.media_download_data_object) {
                if (String(key).indexOf("bandwidth") !== -1) {
                    ywy_file_size_sum += ywy_file_json.download_info.media_download_data_object[key];
                }
            }
            document.getElementById("ywy_media_size").innerText = `檔案大小: ${ywy_format_bytes(ywy_file_size_sum)}`;
            //填入基本訊息結束//

            //基本彈出視窗開始//
            document.getElementById("ywy_media_url").addEventListener("click", function () {
                window.open(ywy_file_json.url, "_blank", "noreferrer");
            });

            document.getElementById("ywy_media_picture").addEventListener("click", function () {
                window.open(ywy_file_json.picture, "_blank", "noreferrer");
            });

            document.getElementById("ywy_button_report").addEventListener("click", function () {
                window.open(`https://docs.google.com/forms/d/e/1FAIpQLSf-94JBqZsP51G8bHYc8RuUJOBdF2xOfo9XGWLU4bdh5IS7Ew/viewform?usp=pp_url&entry.955180954=${encodeURIComponent(ywy_file_json.url)}`);
            });
            //基本彈出視窗結束//

            //下載動作開始//
            document.getElementById("ywy_button_download_video").addEventListener("click", function () {
                if (ywy_g_download_video_clicked == false) {
                    ywy_g_download_video_clicked = true;
                    ywy_download(ywy_file_json, "bangumi");
                }
            });

            document.getElementById("ywy_button_download_audio").addEventListener("click", function () {
            });
            //下載動作結束//
        }
    }
}













/*開關開始*/
document.addEventListener("DOMContentLoaded", function () {
    ywy_console();
    ywy_golden_message();
});
/*開關結束*/