const audioURL = 'audio.m4a';
const videoURL = 'video.m4s';

const videoElement = document.createElement('video');
const mediaSource = new MediaSource();

videoElement.src = URL.createObjectURL(mediaSource);

mediaSource.addEventListener('sourceopen', handleSourceOpen);

let sourceBuffer;

function handleSourceOpen() {
  sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E"');

  fetch(audioURL)
    .then(response => response.arrayBuffer())
    .then(audioData => {
      sourceBuffer.appendBuffer(audioData);
    });

  fetch(videoURL)
    .then(response => response.arrayBuffer())
    .then(videoData => {
      sourceBuffer.appendBuffer(videoData);
    });

  sourceBuffer.addEventListener('updateend', handleUpdateEnd);
}

function handleUpdateEnd() {
  if (!mediaSource.updating) {
    if (sourceBuffer.buffered.length === 0) {
      mediaSource.endOfStream();
      const mergedURL = URL.createObjectURL(mediaSource);

      const mergedVideoElement = document.createElement('video');
      mergedVideoElement.src = mergedURL;

      document.body.appendChild(mergedVideoElement);
    } else {
      sourceBuffer.addEventListener('updateend', handleUpdateEnd);
      sourceBuffer.appendBuffer(new Uint8Array());
    }
  }
}
