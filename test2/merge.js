// Load the M4A audio and M4S video files
const audioURL = 'audio.m4a';
const videoURL = 'video.m4s';

const videoElement = document.createElement('video');
const mediaSource = new MediaSource();

videoElement.src = URL.createObjectURL(mediaSource);

mediaSource.addEventListener('sourceopen', handleSourceOpen);

function handleSourceOpen() {
  const sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E"');

  fetch(audioURL)
    .then(response => response.arrayBuffer())
    .then(audioData => {
      // Append the audio data to the source buffer
      sourceBuffer.appendBuffer(audioData);
    });

  fetch(videoURL)
    .then(response => response.arrayBuffer())
    .then(videoData => {
      // Append the video data to the source buffer
      sourceBuffer.appendBuffer(videoData);
    });

  sourceBuffer.addEventListener('updateend', handleUpdateEnd);
}

function handleUpdateEnd() {
  if (!mediaSource.updating && mediaSource.readyState === 'open') {
    // The media source has finished updating, create the URL for the merged video
    const mergedURL = URL.createObjectURL(mediaSource);

    // Set the merged video URL as the source for a video element
    const mergedVideoElement = document.createElement('video');
    mergedVideoElement.src = mergedURL;

    // Append the video element to the DOM or perform any desired actions
    document.body.appendChild(mergedVideoElement);
  }
}
