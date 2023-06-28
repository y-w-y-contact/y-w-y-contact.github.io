function mergeFiles() {
    // Get the file objects from the input fields.
    const audioFile = document.getElementById('audioFile').files[0];
    const videoFile = document.getElementById('videoFile').files[0];
  
    // Merge the files.
    mergeM4AandM4S(audioFile, videoFile, 'output.mp4');
  }
  
  // Merge the M4A audio file and the M4S video file into a single MP4 file.
  function mergeM4AandM4S(audioFile, videoFile, outputFile) {
    // Create a new MediaSource object.
    const mediaSource = new MediaSource();
  
    // Add the M4A audio file to the MediaSource object.
    mediaSource.addSourceBuffer(new ArrayBuffer(audioFile));
  
    // Add the M4S video file to the MediaSource object.
    mediaSource.addSourceBuffer(new ArrayBuffer(videoFile));
  
    // Create a new MediaStream object.
    const mediaStream = new MediaStream();
  
    // Add the MediaSource object to the MediaStream object.
    mediaStream.addTrack(mediaSource.getTrackById('audio'));
    mediaStream.addTrack(mediaSource.getTrackById('video'));
  
    // Create a new Blob object from the MediaStream object.
    const blob = new Blob([mediaStream], {type: 'video/mp4'});
  
    // Save the Blob object to a file.
    saveAs(blob, outputFile);
  }