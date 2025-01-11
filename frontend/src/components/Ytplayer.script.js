const myScript = () => {
  const videoContainer = document.querySelector(".video-container");
  const video = document.querySelector(".video-container video");
  const controlsContainer = document.querySelector(".controls-container");
  const leftSideControls = document.querySelector(".left-side-controls");

  const volumeControl=document.querySelector(".volume-control");
  const volumePanel=document.querySelector(".volume-panel");
  const volumeRange=volumePanel.querySelector("input");
  const volumeProgress=volumePanel.querySelector(".volume-progress");

  const playPauseButton = document.querySelector(".play-pause-btn");
  const fullScreenButton = document.querySelector(".full-screen-btn");
  const volumeButton = document.querySelector(".volume-btn");
  const playButton = document.querySelector(".play");
  const pauseButton = document.querySelector(".pause");
  const fullVolumeButton = document.querySelector(".full-volume");
  const halfVolumeButton = document.querySelector(".half-volume");
  const mutedButton = document.querySelector(".muted");
  const maximizeButton = fullScreenButton?.querySelector('.maximize');
  const minimizeButton = fullScreenButton?.querySelector('.minimize');
  const progressBar=document.querySelector(".progress-bar")
  const watchedBar=document.querySelector(".watched-bar");
  const playHead=document.querySelector(".playhead");


  if (!video || !controlsContainer || !playPauseButton || !fullScreenButton) {
    console.error('Some video control elements are missing.');
    return;
  }

  // Initial styles
  if (pauseButton) pauseButton.style.display = 'none';
  if (halfVolumeButton) halfVolumeButton.style.display='none';
  if (mutedButton) mutedButton.style.display = 'none';
  if (minimizeButton) minimizeButton.style.display = 'none';

  // Adjust controls container width
  const adjustControlWidth = () => {
    const width = window.innerWidth - 30;
    controlsContainer.style.width = width + 'px';
  };

  // Adjust control width on window resize
  window.onresize = adjustControlWidth;
  adjustControlWidth(); // Call it initially

  // Play and Pause logic
  const playPause = () => {
    if (video.paused) {
      video.play();
      if (playButton) playButton.style.display = 'none';
      if (pauseButton) pauseButton.style.display = '';
    } else {
      video.pause();
      if (playButton) playButton.style.display = '';
      if (pauseButton) pauseButton.style.display = 'none';
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    video.muted = !video.muted;
    if (video.muted) {
      if (fullVolumeButton) fullVolumeButton.style.display = 'none';
      if (halfVolumeButton) halfVolumeButton.style.display = 'none';
      if (mutedButton) mutedButton.style.display = '';
      volumeRange.value='0';
    } else {
      volumeRange.value=video.volume*100;
      if(video.volume<=0.5){
        if (fullVolumeButton) fullVolumeButton.style.display="none";
        if (halfVolumeButton) halfVolumeButton.style.display = '';
        if (mutedButton) mutedButton.style.display = 'none';
      }else if(video.volume>0.5){
        if (fullVolumeButton) fullVolumeButton.style.display="";
        if (halfVolumeButton) halfVolumeButton.style.display = 'none';
        if (mutedButton) mutedButton.style.display = 'none';
      }
    }
  };

  // Fullscreen toggle
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Fullscreen change logic
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      if (maximizeButton) maximizeButton.style.display = '';
      if (minimizeButton) minimizeButton.style.display = 'none';
    } else {
      if (maximizeButton) maximizeButton.style.display = 'none';
      if (minimizeButton) minimizeButton.style.display = '';
    }
  });

  // console.log(video);
// console.log(watchedBar);
// console.log(progressBar);


  // Event listeners
  if (video) {
    video.addEventListener('timeupdate', function () {
      // console.log('Video currentTime:', video.currentTime);
    // console.log('Video duration:', video.duration);
      if (video.duration) {
        var watched = (100 / video.duration) * video.currentTime;
        if (watchedBar) {
          watchedBar.style.width = watched + '%';
        }
        if (playHead){
          playHead.style.left=watched + '%';
        }
      }

      if(video.ended){
        playButton.style.display="";
        pauseButton.style.display="none"
      }
    });
  }
  
  // Event listener to seek video when progress bar is clicked
  progressBar.addEventListener("mousedown", function (event) {
    // Calculate the click position relative to the progress bar width
    const pos = (event.pageX - (progressBar.offsetLeft+progressBar.offsetParent.offsetLeft)) / progressBar.offsetWidth;
    video.currentTime = pos * video.duration;
  });

  video.addEventListener('click', playPause);
  video.addEventListener('dblclick', toggleFullScreen);
  if (playPauseButton) playPauseButton.addEventListener('click', playPause);
  if (volumeButton) volumeButton.addEventListener('click', toggleMute);
  if (fullScreenButton) fullScreenButton.addEventListener('click', toggleFullScreen);

  if(volumeRange) volumeRange.addEventListener('input',function(e){
    if(volumeProgress) volumeProgress.style.width=volumeRange.value + '%';
    video.volume=volumeRange.value/100;
    if(volumeRange.value<=0){
      fullVolumeButton.style.display="none";
      halfVolumeButton.style.display="none";
      mutedButton.style.display=''
    }
    else if (volumeRange.value<=50){
      video.muted=false;
      fullVolumeButton.style.display="none";
      halfVolumeButton.style.display="";
      mutedButton.style.display='none'
    }
    else if (volumeRange.value>50){
      video.muted=false;
      fullVolumeButton.style.display="";
      halfVolumeButton.style.display="none";
      mutedButton.style.display='none'
    }
  },false)


  if(volumeButton) volumeButton.addEventListener('mouseenter',function(){
    if(volumeControl) volumeControl.style.margin='0px 2px 0px 0px';
    if(volumePanel) volumePanel.style.width='52px';
  });


  if(leftSideControls) leftSideControls.addEventListener('mouseleave',function(){
    if(volumeControl) volumeControl.style.margin='0px 0px 0px 0px';
    if(volumePanel) volumePanel.style.width='0px';
  });

  setInterval(function(){
    if(volumeProgress) volumeProgress.style.width=volumeRange.value+"%";
  })
};

export default myScript;
