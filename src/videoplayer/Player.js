import React, { useState, useRef } from 'react';
import './player.scss';
import ReactPlayer from 'react-player';
import screenful from 'screenfull';
import Controls from './Controls';

const format = (seconds) => {
  if (isNaN(seconds)) {
    return `00:00`;
  }
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, '0');
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
  }
  return `${mm}:${ss}`;
};

let count = 0;

function Player(props) {
  const { videoUrl } = props;
  const [state, setState] = useState({
    pip: false,
    playing: false,
    controls: false,
    light: false,
    muted: true,
    played: 0,
    duration: 0,
    playbackRate: 1.0,
    volume: 1,
    loop: false,
    seeking: false,
    fullscreen: false,
  });
  const [timeDisplayFormat, setTimeDisplayFormat] = useState('normal');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [playerError, setPlayerError] = useState(false);

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsRef = useRef(null);
  const { playing, controls, light, muted, loop, playbackRate, pip, played, seeking, volume, fullscreen } = state;

  const handlePlayPause = () => {
    setState({ ...state, playing: !state.playing });
  };

  const handleRewind = (ev) => {
    ev.stopPropagation();
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };

  const handleFastForward = (ev) => {
    ev.stopPropagation();
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  const handleProgress = (changeState) => {
    if (count > 3) {
      controlsRef.current.style.visibility = 'hidden';
      controlsRef.current.style.transition = 'all 0.4s ease-in-out';
      controlsRef.current.style.opacity = 0;
      count = 0;
    }
    if (controlsRef.current.style.visibility === 'visible') {
      count += 1;
    }
    if (!state.seeking) {
      setState({ ...state, ...changeState });
    }
  };

  const handleReady = () => {
    setIsLoading(false);
    setPlayerError(false);
  };

  const handleStart = () => {
    setIsLoading(false);
    setPlayerError(false);
  };

  const handleEnded = () => {
    setState({ ...state, playing: false });
  };

  const handleSeekChange = (newValue) => {
    setState({ ...state, played: parseFloat(newValue / 100) });
  };

  const handleSeekMouseDown = () => {
    setState({ ...state, seeking: true });
  };

  const handleSeekMouseUp = (newValue) => {
    setState({ ...state, seeking: false });
    playerRef.current.seekTo(newValue / 100, 'fraction');
  };

  const handleDuration = (duration) => {
    setState({ ...state, duration });
  };

  const handleVolumeSeekDown = (newValue) => {
    setState({ ...state, seeking: false, volume: parseFloat(newValue / 100) });
  };

  const handleVolumeChange = (newValue) => {
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };

  const toggleFullScreen = () => {
    screenful.toggle(playerContainerRef.current);
    setState({ ...state, fullscreen: !state.fullscreen });
  };

  const handleMouseMove = () => {
    controlsRef.current.style.visibility = 'visible';
    controlsRef.current.style.transition = 'all 0.4s ease-in-out';
    controlsRef.current.style.opacity = 1;
    count = 0;
  };

  const hanldeMouseLeave = () => {
    if (!playing) {
      return false;
    } else {
      if (!isLoading) {
        controlsRef.current.style.visibility = 'hidden';
        controlsRef.current.style.transition = 'all 0.4s ease-in-out';
        controlsRef.current.style.opacity = 0;
      }
      count = 0;
    }
  };

  const handlePlaybackRate = (rate) => {
    setState({ ...state, playbackRate: rate });
  };

  const hanldeMute = () => {
    setState({ ...state, muted: !state.muted });
  };

  const handleBuffer = () => {
    handleVideoLoading();
    setIsPlaying(false);
  };

  const handleBufferEnd = () => {
    setIsLoading(false);
    setIsPlaying(true);
  };

  const handleError = () => {
    setPlayerError(true);
    setIsLoading(false);
    setIsPlaying(false);
  };

  const handleVideoLoading = () => {
    setPlayerError(false);
    handleMouseMove();
    setIsLoading(true);
    setIsPlaying(false);
  };

  const currentTime = playerRef && playerRef.current ? playerRef.current.getCurrentTime() : '00:00';

  const duration = playerRef && playerRef.current ? playerRef.current.getDuration() : '00:00';
  const elapsedTime = timeDisplayFormat === 'normal' ? format(currentTime) : `-${format(duration - currentTime)}`;

  const totalDuration = format(duration);
  const remainingTime = format(duration - currentTime);

  return (
    <div onMouseMove={handleMouseMove} onMouseLeave={hanldeMouseLeave} ref={playerContainerRef} id='playerWrapper' className='player-wrapper'>
      <ReactPlayer
        ref={playerRef}
        width='100%'
        height='100%'
        playsinline={true}
        url={videoUrl}
        pip={pip}
        playing={playing}
        controls={false}
        light={light}
        loop={loop}
        playbackRate={playbackRate}
        volume={volume}
        muted={muted}
        onReady={handleReady}
        onStart={handleStart}
        onProgress={handleProgress}
        onEnded={handleEnded}
        onBuffer={handleBuffer}
        onBufferEnd={handleBufferEnd}
        onError={handleError}
      />
      <Controls
        ref={controlsRef}
        onSeek={handleSeekChange}
        onSeekMouseDown={handleSeekMouseDown}
        onSeekMouseUp={handleSeekMouseUp}
        onDuration={handleDuration}
        onRewind={handleRewind}
        onPlayPause={handlePlayPause}
        onFastForward={handleFastForward}
        playing={playing}
        played={played}
        elapsedTime={elapsedTime}
        totalDuration={totalDuration}
        remainingTime={remainingTime}
        onMute={hanldeMute}
        muted={muted}
        onVolumeChange={handleVolumeChange}
        onVolumeSeekDown={handleVolumeSeekDown}
        playbackRate={playbackRate}
        onPlaybackRateChange={handlePlaybackRate}
        onToggleFullScreen={toggleFullScreen}
        volume={volume}
        fullscreen={fullscreen}
        isLoading={isLoading}
      />
      {playerError && <div className='player-error'>Can't play this video. Please try another video.</div>}
    </div>
  );
}

export default Player;
