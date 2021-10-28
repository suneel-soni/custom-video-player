import React, { forwardRef, Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Slider, Spin } from 'antd';
import { CaretRightOutlined, PauseOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import MeterIcon from './images/meter.svg';
import RewindIcon from './images/rewind.svg';
import ForwardIcon from './images/forward.svg';
import VolumeFullIcon from './images/volume-full.svg';
import VolumeHalfIcon from './images/volume-half.svg';
import VolumeMuteIcon from './images/volume-mute.svg';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 64, color: '#fff' }} spin />;

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <div open={open} enterTouchDelay={0} placement='top' title={value}>
      {value}
    </div>
  );
}

const Controls = forwardRef(
  (
    {
      onSeek,
      onSeekMouseDown,
      onSeekMouseUp,
      onDuration,
      onRewind,
      onPlayPause,
      onFastForward,
      playing,
      played,
      elapsedTime,
      totalDuration,
      remainingTime,
      onMute,
      muted,
      onVolumeSeekDown,
      playbackRate,
      onPlaybackRateChange,
      onToggleFullScreen,
      volume,
      onVolumeChange,
      fullscreen,
      videoDetails,
      isLoading,
    },
    ref
  ) => {
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
      const muted = JSON.parse(localStorage.getItem('muted'));
      setIsMuted(muted);
    }, []);

    const handleUnMute = () => {
      setIsMuted(false);
      onMute();
    };

    return (
      <div ref={ref} id='controlsWrapper' onClick={() => (muted && isMuted ? handleUnMute() : null)}>
        {isLoading ? (
          <div className='playerLoader'>
            <Spin indicator={antIcon} />
          </div>
        ) : (
          <Fragment>
            <div onClick={onPlayPause} onDoubleClick={onToggleFullScreen} id='controlsTop'>
              <button onClick={onRewind}>
                <img src={RewindIcon} alt='' className='rewindForwardIcons' />
              </button>
              <button className='playPauseButton'>{playing ? <PauseOutlined /> : <CaretRightOutlined />}</button>
              <button onClick={onFastForward}>
                <img src={ForwardIcon} alt='' className='rewindForwardIcons' />
              </button>
            </div>
            <div id='controlsBottom'>
              <div id='progressBar'>
                <span className='videoDuration' style={{ marginRight: 5 }}>
                  {elapsedTime}
                </span>
                <Slider
                  min={0}
                  max={100}
                  tipFormatter={(props) => <ValueLabelComponent {...props} value={elapsedTime} />}
                  value={played * 100}
                  onChange={onSeek}
                  onMouseDown={onSeekMouseDown}
                  onAfterChange={onSeekMouseUp}
                  onDuration={onDuration}
                  step={0.01}
                />
                <span className='videoDuration' style={{ justifySelf: 'flex-end' }}>
                  {remainingTime}
                </span>
              </div>

              <div id='controlsGrid'>
                <div className='controlsItems'>
                  <button onClick={onPlayPause}>{playing ? <PauseOutlined /> : <CaretRightOutlined />}</button>
                  <button className='volumeButton'>
                    {muted ? (
                      <img src={VolumeMuteIcon} onClick={onMute} alt='' />
                    ) : volume * 100 <= 50 ? (
                      <img src={VolumeHalfIcon} onClick={onMute} alt='' />
                    ) : (
                      <img src={VolumeFullIcon} onClick={onMute} alt='' />
                    )}
                    <div className='volumeControls'>
                      <Slider
                        min={0}
                        max={100}
                        value={muted ? 0 : volume * 100}
                        onChange={onVolumeChange}
                        onMouseDown={onSeekMouseDown}
                        onAfterChange={onVolumeSeekDown}
                        defaultValue={100}
                        tooltipVisible={false}
                        vertical={true}
                      />
                    </div>
                  </button>
                  <button className='speedButton'>
                    <img src={MeterIcon} alt='' />
                    <div className='speedControls'>
                      <ul>
                        {[0.5, 1, 1.5, 2].map((rate) => (
                          <li key={rate} onClick={() => onPlaybackRateChange(rate)}>
                            {rate === playbackRate ? <span className='activeSpeedRate'>{rate}x</span> : <span>{rate}x</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className='speedInfo'>
                      <span className='controls-text'>Speed ({playbackRate}x)</span>
                    </div>
                  </button>
                </div>
                <div className='controlsItems' style={{ justifyContent: 'flex-end' }}>
                  <button onClick={onToggleFullScreen}>{fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}</button>
                </div>
              </div>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
);

Controls.propTypes = {
  onSeek: PropTypes.func,
  onSeekMouseDown: PropTypes.func,
  onSeekMouseUp: PropTypes.func,
  onDuration: PropTypes.func,
  onRewind: PropTypes.func,
  onPlayPause: PropTypes.func,
  onFastForward: PropTypes.func,
  onVolumeSeekDown: PropTypes.func,
  onPlaybackRateChange: PropTypes.func,
  onToggleFullScreen: PropTypes.func,
  onMute: PropTypes.func,
  playing: PropTypes.bool,
  played: PropTypes.number,
  elapsedTime: PropTypes.string,
  totalDuration: PropTypes.string,
  muted: PropTypes.bool,
  playbackRate: PropTypes.number,
  fullscreen: PropTypes.bool,
};

export default Controls;
