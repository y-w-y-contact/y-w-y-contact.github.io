/*函數庫開始*/
function ywy_base64_decode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
function ywy_format_bytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
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
function ywy_golden_message() {
    let this_message = ["觀看影片時，應與螢幕保持適當距離", "每觀看影片30分鐘，應至少讓眼睛休息5分鐘", "觀看影片時，應保持室內光線充足", "雖然影片很好看，但不應當沉迷", "抽菸是一種花錢來傷害身體的愚蠢行為", "影片內容多為虛構，請勿與現實混淆", "觀看暴力及情色影片，將有害身心健康", "請勿因生活不順遂，而躲進影片的虛假空間", "心情不好時，不妨唸句「阿彌陀佛 」", "如果認為影片中的主角很厲害，請好好充實自己", "文字是最基本的工具，應當好好學習", "熬夜很傷身體，請不要熬夜觀看影片", "喜歡羅莉是一種病，你該接受心理治療", "多到戶外走走，將會有意想不到的收穫", "金錢買不到時間，請勿虛度光陰", "影片與電腦都是虛擬的，只有人生才是現實的", "多與人交際相處，人生將會是充實的", "適當的運動及曬太陽，將有益身體健康", "勿以善小而不為，勿以惡小而為之", "即便暫時找不到人生的方向，也不要放棄自己", "抽菸喝酒吃檳榔，傷身傷神又傷錢", "人生沒有那麼容易，失敗是很正常的", "如果你喜歡幼女，請趕快去看心理醫生", "避免說髒話，提升自我素養", "開玩笑前，請先考慮是否會傷害到別人", "人生就那麼一次，請好好陪伴家人", "你必須專精一件事，但你也需要了解許多事", "如果累了，就休息吧，明天會更好", "如果你在學校被霸凌，請趕快告訴家長", "如果你在家中被欺負，請告訴學校老師", "如果你有多餘的能力，請幫助需要的人", "不要怕事情多，那都將成為你的經驗", "當有人摸魚時，你該慶幸，你學會的比他還多", "如果你不希望動物遭到殺害，你可以試著吃素食", "當你受傷感到痛楚時，你該想想被你吃掉的動物", "己所不欲，勿施於人", "每天做一件好事，請從微笑開始", "讓座給老人或需要的人，是一種美德", "計較的越多，失去的越多", "自殘是一種愚蠢行為，請不要這麼做", "多與朋友聊天，可以減少心理壓力", "看到別人有難時，請趕快伸出援手", "心裡有雜念時，就唸句「阿彌陀佛」吧"];
    let this_golden = this_message[Math.floor(Math.random() * this_message.length)];
    document.getElementById("ywy_golden_message").innerText = this_golden;
}

function ywy_download_success() {
    let tracker;
    if ('ga' in window) {
        tracker = window.ga.getAll()[0];
    }
    //取得下載歷程開始//
    ywy_g_download_time_end = performance.now();
    if (tracker) {
        tracker.send('event', 'by_extension', 'download_success', Math.round((ywy_g_download_time_end - ywy_g_download_time_start) / 1000));
    }
    //取得下載歷程結束//

    //會員調查開始//
    if (!localStorage.hasOwnProperty("ywy_member_check_roll_review")) {
        localStorage.setItem("ywy_member_check_roll_review", "finished");
        document.getElementById("ywy_member_check").style.display = "flex";
    }

    document.getElementById("ywy_member_check_dialog_btn_yes").addEventListener("click", function () {
        document.getElementById("ywy_member_check").remove();
        window.open("http://bit.ly/2wMc4w6");
        if (tracker) {
            tracker.send('event', 'review', 'by_extension', 'fire');
        }
    });

    document.getElementById("ywy_member_check_dialog_btn_no").addEventListener("click", function () {
        document.getElementById("ywy_member_check").remove();
        if (tracker) {
            tracker.send('event', 'review', 'by_extension', 'nope');
        }
    });
    //會員調查結束//
}

function ywy_xhr_by_range(this_url, this_range, this_part, this_index) {
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
                    window[`blob_part_${this_part}`][this_index] = this_blob;
                    ywy_g_downloader_mission_state[this_index] = 2;
                    this_blob = null;
                    delete xhr;
                    ywy_g_downloader_workers--;
                    resolve("ok");
                } else {
                    delete this_blob;
                    ywy_g_downloader_mission_state[this_index] = 0;
                    ywy_g_downloader_workers--;
                    resolve("err");
                }
            }
        });

        xhr.ontimeout = function () {
            delete xhr;
            ywy_g_downloader_mission_state[this_index] = 0;
            ywy_g_downloader_workers--;
            resolve("err");
        };

        xhr.onerror = function () {
            delete xhr;
            ywy_g_downloader_mission_state[this_index] = 0;
            ywy_g_downloader_workers--;
            resolve("err");
        };

        xhr.responseType = "blob";
        xhr.open("get", this_url);
        xhr.setRequestHeader("Range", `bytes=${this_range}`);
        xhr.timeout = 1000 * 60;
        xhr.send();
    });
}
function ywy_xhr_for_audio_only(this_url, this_id, this_size) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function (e) {
            if (xhr.readyState == 4) {
                let this_blob = xhr.response;
                if (typeof window[`blob_by_id_${this_id}`] === "undefined") {
                    window[`blob_by_id_${this_id}`] = "";
                }

                if (this_blob.size >= this_size) {
                    window[`blob_by_id_${this_id}`] = this_blob;
                    this_blob = null;
                    delete xhr;
                    resolve("ok");
                } else {
                    delete this_blob;
                    resolve("err");
                }
            }
        });

        xhr.addEventListener("progress", function (event) {
            if (event.lengthComputable) {
                let this_percent = ((event.loaded / event.total) * 100).toFixed(2);
                document.getElementById("ywy_button_download_audio").innerText = `${this_percent} %`;
            } else {
                document.getElementById("ywy_button_download_audio").innerText = "下載中";
            }
        });

        xhr.ontimeout = function () {
            delete xhr;
            resolve("err");
        };

        xhr.onerror = function () {
            delete xhr;
            resolve("err");
        };

        xhr.responseType = "blob";
        xhr.open("get", this_url);
        xhr.timeout = 1000 * 60;
        xhr.send();
    });
}
function ywy_get_file_size(this_uri) {
    return new Promise(function (resolve, reject) {
        fetch(this_uri, {
            method: "HEAD"
        })
            .then(response => {
                resolve(Number(response.headers.get('Content-Length')));
            })
    });
}

var ywy_download_master_is_busy = false;
function ywy_download_master() {
    return new Promise(function (resolve, reject) {
        let this_total = ywy_g_downloader_mission.length;
        let this_done = 0;
        let this_timer = setInterval(async function () {
            if (ywy_g_downloader_mission_state.includes(0) == false && ywy_g_downloader_mission_state.includes(1) == false) {
                clearInterval(this_timer);
                resolve("ok");
            } else {
                if (ywy_download_master_is_busy == false) {
                    if (ywy_g_downloader_mission_state.includes(0)) {
                        if (ywy_g_downloader_workers < ywy_g_downloader_workers_limit) {
                            ywy_download_master_is_busy = true;
                            let this_index = ywy_g_downloader_mission_state.indexOf(0);
                            ywy_g_downloader_mission_state[this_index] = 1;
                            ywy_g_downloader_workers++;
                            let this_mission = ywy_g_download_file_list[ywy_g_downloader_mission[this_index][1]];
                            let this_range = ywy_g_downloader_mission[this_index][0];
                            let this_part = ywy_g_downloader_mission[this_index][1];
                            ywy_download_master_is_busy = false;
                            let this_download = await ywy_xhr_by_range(this_mission, this_range, this_part, this_index);
                            if (this_download == "ok") {
                                this_done += 1;
                                document.getElementById("ywy_button_download_video").innerText = `${((this_done / this_total) * 100).toFixed(2)} %`;
                            }
                        }
                    }
                }
            }
        }, 50);
    });
}


async function ywy_download(ywy_file_json, this_player_type) {
    ywy_g_download_time_start = performance.now();
    document.getElementById("ywy_button_download_video").innerText = "準備中";
    if (this_player_type == "bangumi" || this_player_type == "video") {
        //取得下載列表開始//
        for (key in ywy_file_json.download_info.media_download_data_object) {
            if (String(key).indexOf("uri") !== -1) {
                ywy_g_download_file_list.push([ywy_file_json.download_info.media_download_data_object[key], ywy_file_json.download_info.media_download_data_object[String(key).replace("uri", "bandwidth")]])
                ywy_g_download_file_index++;
            }
        }
        //取得下載列表結束//

        //切片開始//
        for (let i = 0; i < ywy_g_download_file_list.length; i++) {
            let this_range_going = 0;
            while (true) {
                if (ywy_g_download_file_list[i][1] <= ywy_g_downloader_limit) {
                    ywy_g_downloader_mission.push([`0-${ywy_g_download_file_list[i][1] - 1}`, i]);
                    ywy_g_downloader_mission_state.push(0);
                    break;
                } else {
                    if (this_range_going == 0) {
                        //頭
                        ywy_g_downloader_mission.push([`0-${ywy_g_downloader_limit - 1}`, i]);
                        ywy_g_downloader_mission_state.push(0);
                        this_range_going += ywy_g_downloader_limit;
                    } else if (this_range_going + ywy_g_downloader_limit >= ywy_g_download_file_list[i][1]) {
                        //尾
                        ywy_g_downloader_mission.push([`${this_range_going}-${ywy_g_download_file_list[i][1]}`, i]);
                        ywy_g_downloader_mission_state.push(0);
                        break;
                    } else {
                        //中
                        ywy_g_downloader_mission.push([`${this_range_going}-${this_range_going + ywy_g_downloader_limit - 1}`, i]);
                        ywy_g_downloader_mission_state.push(0);
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

        //清除empty開始//
        for (let i = 0; i < ywy_g_download_file_list.length; i++) {
            window[`blob_part_${i}`] = window[`blob_part_${i}`].filter(function (element) {
                return element !== undefined;
            });
        }
        //清除empty開始//

        //blob切片合併開始//
        document.getElementById("ywy_button_download_video").innerText = "合併切片";
        for (let i = 0; i < ywy_g_download_file_index; i++) {
            window[`file_${i}`] = new Blob(window[`blob_part_${i}`], { type: "video/mp4" });
            window[`blob_part_${i}`] = null;
        }
        //blob切片合併結束//

        //釋放部分記憶體開始//
        ywy_g_download_file_list = null;
        ywy_g_downloader_mission = null;
        ywy_g_downloader_mission_state = null;
        //釋放部分記憶體結束//

        //合併音訊和影片開始//
        const { createFFmpeg, fetchFile } = FFmpeg;
        let ffmpeg = null;
        if (ffmpeg === null) {
            ffmpeg = createFFmpeg({ log: false });
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

        //釋放file開始//
        for (let i = 0; i < ywy_g_download_file_index; i++) {
            window[`file_${i}`] = null;
        }
        //釋放file結束//

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
                ffmpeg = null;
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
var ywy_g_downloader_mission_state = [];
var ywy_g_downloader_limit = (Math.floor(Math.random() * (1234 - 567 + 1)) + 567) * 1024;

var ywy_g_downloader_workers = 0;
var ywy_g_downloader_workers_limit = 1;

var ywy_g_files_size = 0;


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
                //補size開始//
                //ywy_file_json.download_info.media_download_data_object
                for (key in ywy_file_json.download_info.media_download_data_object) {
                    if (String(key).indexOf("uri") !== -1) {
                        if (!ywy_file_json.download_info.media_download_data_object.hasOwnProperty(String(key).replace("uri", "bandwidth"))) {
                            ywy_file_json.download_info.media_download_data_object[String(key).replace("uri", "bandwidth")] = await ywy_get_file_size(ywy_file_json.download_info.media_download_data_object[key]);
                        }
                    }
                }
                //補size結束//
            }
        }
        //API調用結束//

        if (ywy_file_json.type == "bangumi" || ywy_file_json.type == "video") {
            //填入基本訊息開始//
            document.getElementById("ywy_image_box").src = ywy_file_json.picture;
            document.getElementById("ywy_media_title_mother").innerText = `名稱: ${ywy_file_json.title_mother}`;

            let ywy_title_child_fix = "";
            if (ywy_file_json.epsiode > 1) {
                if (ywy_file_json.type == "bangumi") {
                    ywy_title_child_fix = `第${ywy_file_json.epsiode}集-${ywy_file_json.title_child}`;
                } else if (ywy_file_json.type == "video") {
                    ywy_title_child_fix = `第${Number(ywy_file_json.epsiode) + 1}集-${ywy_file_json.title_child}`;
                }

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
            if(ywy_file_size_sum >= 2040109465){
                document.getElementById("ywy_media_size").innerText += " (檔案大於1.9 GB，基於瀏覽器限制，請使用電腦版下載，避免發生問題)";
            }
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

            document.getElementById("ywy_button_download_audio").addEventListener("click", async function () {
                if (ywy_g_download_audio_clicked == false) {
                    document.getElementById("ywy_button_download_audio").innerText = "準備";
                    ywy_g_download_audio_clicked = true;
                    let this_id = String(Date.now());
                    let this_url = ywy_file_json.download_info.media_download_data_object.audio_uri;
                    let this_size = ywy_file_json.download_info.media_download_data_object.audio_bandwidth;
                    let this_download = await ywy_xhr_for_audio_only(this_url, this_id, this_size);
                    if (this_download == "ok") {
                        let this_ele = document.createElement("a");
                        this_ele.href = URL.createObjectURL(window[`blob_by_id_${this_id}`]);
                        this_ele.download = `(音訊)${document.getElementById("ywy_media_title_mother").innerText.substring(4)}-${document.getElementById("ywy_media_title_child").innerText.substring(4)}.m4a`;
                        document.body.append(this_ele);
                        this_ele.click();
                        document.getElementById("ywy_button_download_audio").innerText = "下載完成";
                    } else {
                        document.getElementById("ywy_button_download_audio").innerText = "下載失敗";
                    }
                }
            });
            //下載動作結束//
        } else if (ywy_file_json.type == "audio") {
            //填入基本訊息開始//
            document.getElementById("ywy_image_box").src = ywy_file_json.picture;
            document.getElementById("ywy_media_title_mother").innerText = `名稱: ${ywy_file_json.title}`;
            document.getElementById("ywy_media_url").innerText = `原始網址: ${ywy_file_json.url}`;
            document.getElementById("ywy_media_picture").innerText = `封面圖片: ${ywy_file_json.picture}`;

            let ywy_file_size_sum = 0;
            for (key in ywy_file_json.download_info.media_download_data_object) {
                if (String(key).indexOf("bandwidth") !== -1) {
                    ywy_file_size_sum += ywy_file_json.download_info.media_download_data_object[key];
                }
            }
            document.getElementById("ywy_media_size").innerText = `檔案大小: ${ywy_format_bytes(ywy_file_size_sum)}`;

            document.getElementById("ywy_button_download_video").innerText = "點此下載音樂";
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

            document.getElementById("ywy_button_download_video").style.display = "none";
            //基本彈出視窗結束//

            //下載動作開始//
            document.getElementById("ywy_button_download_audio").addEventListener("click", async function () {
                if (ywy_g_download_audio_clicked == false) {
                    document.getElementById("ywy_button_download_audio").innerText = "準備";
                    ywy_g_download_audio_clicked = true;
                    let this_id = String(Date.now());
                    let this_url = ywy_file_json.download_info.media_download_data_object.audio_uri;
                    let this_size = ywy_file_json.download_info.media_download_data_object.audio_bandwidth;
                    let this_download = await ywy_xhr_for_audio_only(this_url, this_id, this_size);
                    if (this_download == "ok") {
                        let this_ele = document.createElement("a");
                        this_ele.href = URL.createObjectURL(window[`blob_by_id_${this_id}`]);
                        this_ele.download = `(音訊)${document.getElementById("ywy_media_title_mother").innerText.substring(4)}.m4a`;
                        document.body.append(this_ele);
                        this_ele.click();
                        document.getElementById("ywy_button_download_audio").innerText = "下載完成";
                    } else {
                        document.getElementById("ywy_button_download_audio").innerText = "下載失敗";
                    }
                }
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