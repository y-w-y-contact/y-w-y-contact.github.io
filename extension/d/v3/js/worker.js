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
                                self.postMessage({action:"update_percent", data: `${((this_done / this_total) * 100).toFixed(2)} %`});
                            }
                        }
                    }
                }
            }
        }, 50);
    });
}

var ywy_g_downloader_mission;
var ywy_g_downloader_mission_state;
var ywy_g_download_file_list;
var ywy_g_downloader_workers = 0;
var ywy_g_downloader_workers_limit = 1;

self.onmessage =async function (event) {
    console.log(event)
    let this_action = event.action;
    let this_data = event.data;

    switch (this_action) {
        case "download_master":
            ywy_g_downloader_mission = this_data.ywy_g_downloader_mission;
            ywy_g_downloader_mission_state = this_data.ywy_g_downloader_mission_state;
            ywy_g_download_file_list = this_data.ywy_g_download_file_list;
            await ywy_download_master();

            let this_blob_part = [];
            for(let i=0;i<ywy_g_download_file_list.length;i++){
                this_data.push(window[`blob_part_${i}`]);
            }

            self.postMessage({action:"download_done",data: this_blob_part});
            break;
    }
};