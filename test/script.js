// Variables to store the selected M4S audio and video files
let audioFile = null;
let videoFile = null;

// Function to handle file selection
function handleFileSelection(event, type) {
    const file = event.target.files[0];

    if (type === 'audio') {
        audioFile = file;
        console.log('Selected audio file:', audioFile);
    } else if (type === 'video') {
        videoFile = file;
        console.log('Selected video file:', videoFile);
    }
}

// Function to merge the selected audio and video files
async function mergeFiles() {
    if (audioFile && videoFile) {
        const audioUrl = URL.createObjectURL(audioFile);
        const videoUrl = URL.createObjectURL(videoFile);

        // Re-encode audio and video files
        const reencodedAudioBlob = await reencodeAudio(audioUrl);
        const reencodedVideoBlob = await reencodeVideo(videoUrl);

        // Merge re-encoded audio and video
        const mergedBlob = mergeBlobs(reencodedAudioBlob, reencodedVideoBlob);

        const mergedVideo = document.getElementById('mergedVideo');
        mergedVideo.src = URL.createObjectURL(mergedBlob);
        console.log('Merged video URI:', mergedVideo.src);
    } else {
        console.log('Please select both audio and video files.');
    }
}

// Function to re-encode the audio file
async function reencodeAudio(audioUrl) {
    const audioBuffer = await fetch(audioUrl).then(response => response.arrayBuffer());
    const audioData = new Uint8Array(audioBuffer);

    // Configure FFmpeg.js
    const { createFFmpeg, fetchFile } = FFmpeg;
    const ffmpeg = createFFmpeg({
        log: true,
        corePath: 'vendor/ffmpeg-core.js',
    });
    await ffmpeg.load();

    // Write the audio data to a file
    ffmpeg.FS('writeFile', 'audio.m4a', audioData);

    // Re-encode audio using AAC codec
    await ffmpeg.run('-i', 'audio.m4a', '-c:a', 'aac', '-strict', 'experimental', 'reencoded_audio.mp4');

    // Read the re-encoded audio data
    const reencodedAudioData = ffmpeg.FS('readFile', 'reencoded_audio.mp4');

    // Clean up FFmpeg.js resources
    ffmpeg.FS('unlink', 'audio.m4a');
    ffmpeg.FS('unlink', 'reencoded_audio.mp4');

    return new Blob([reencodedAudioData.buffer]);
}

// Function to re-encode the video file
async function reencodeVideo(videoUrl) {
    const videoBuffer = await fetch(videoUrl).then(response => response.arrayBuffer());
    const videoData = new Uint8Array(videoBuffer);

    // Configure FFmpeg.js
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();

    // Write the video data to a file
    ffmpeg.FS('writeFile', 'video.mp4', videoData);

    // Re-encode video using H.264 codec
    await ffmpeg.run('-i', 'video.mp4', '-c:v', 'libx264', 'reencoded_video.mp4');

    // Read the re-encoded video data
    const reencodedVideoData = ffmpeg.FS('readFile', 'reencoded_video.mp4');

    // Clean up FFmpeg.js resources
    ffmpeg.FS('unlink', 'video.mp4');
    ffmpeg.FS('unlink', 'reencoded_video.mp4');

    return new Blob([reencodedVideoData.buffer]);
}

// Function to merge audio and video Blobs
function mergeBlobs(audioBlob, videoBlob) {
    const mergedData = new Uint8Array(audioBlob.size + videoBlob.size);
    mergedData.set(new Uint8Array(audioBlob), 0);
    mergedData.set(new Uint8Array(videoBlob), audioBlob.size);

    return new Blob([mergedData], { type: 'video/mp4' });
}

// Event listeners for file inputs and merge button
const audioInput = document.getElementById('audioInput');
const videoInput = document.getElementById('videoInput');
const mergeBtn = document.getElementById('mergeBtn');

audioInput.addEventListener('change', (event) => handleFileSelection(event, 'audio'));
videoInput.addEventListener('change', (event) => handleFileSelection(event, 'video'));
mergeBtn.addEventListener('click', mergeFiles);
