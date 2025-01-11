import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router-dom';
import axios from "axios"
import play from "./svg/play.svg"
import pause from "./svg/pause.svg"
import volume from "./svg/volume.svg"
import half_volume from "./svg/half-volume.svg"
import settings from "./svg/settings.svg"
import next from "./svg/next.svg"
import mute from "./svg/mute.svg"
import minimize_screen from "./svg/minimize-screen.svg"
import maximize_screen from "./svg/maximize-screen.svg"
import chevron_right from "./svg/chevron-right.svg"
import checkmark from "./svg/checkmark.svg"
import captions from "./svg/captions.svg"
import myScript from "./Ytplayer.script.js"
const backend_url=process.env.REACT_APP_BACKEND_URL


const Ytplayer=({ videos })=>{

  // const[videos,setVideos]=useState(null);

  // useEffect(() => {
  //   const fetchVideos = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:5000/api/homeContent/fetchvideos/${props.id}`);
  //       setVideos(response.data);
  //     } catch (error) {
  //       console.error('Error fetching video:', error);
  //     }
  //   };
  //   fetchVideos();
  // }, [props.id])
  

  useEffect(() => {
    myScript();
  }, [videos]);

    return(
        <>
            <div className="video-container">
              <video >
                <source src={`${backend_url}/uploads/videos/${videos.filename}`} type="video/mp4" />
              </video>

              <div className="controls-container">
                <div className="progress-controls">
                  <div className="progress-bar">
                    <div className="progress">
                      <div className="watched-progress">
                          <div className="watched-bar"></div>
                          <div className="playhead"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="controls">
                  <div className="left-side-controls">
                    <div className="play-pause-btn btn">
                      <img draggable="false" className='play' src={play} alt="" width="20px" />
                      <img draggable="false" className='pause' src={pause} alt="" width="20px"/>
                    </div>
                    <div className="next-video-btn btn">
                      <img draggable="false" src={next} alt="" width="20px" />

                    </div>
                    <div className="volume-control">
                      <div className="volume-btn btn">
                        <img draggable="false" className='full-volume'  src={volume} alt="" width="20px" />
                        <img draggable="false" className='half-volume'  src={half_volume} alt="" width="20px" />
                        <img draggable="false" className='muted' src={mute} alt="./svg/mute.svg" width="20px"/>
                      </div>
                      <div className="volume-panel">
                        <div className="input-div">
                          <div className="volume-input-div">
                            <input type="range" value="100" step="5" />
                            <div className="volume-progress"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="time-display">
                      <span className="current-time">0:00</span>
                      <span className="time-separator"> &nbsp;/&nbsp; </span>
                      <span className="Video-duration">{videos.duration}</span>
                    </div>
                  </div>

                  <div className="right-side-controls">
                    <div className="settings-btn btn">
                      <img draggable="false" src={settings} alt="" width="20px"/>
                    </div>
                    <div className="full-screen-btn btn">
                      <img draggable="false" className='maximize' src={maximize_screen} alt="" width="20px"/>
                      <img draggable="false" className='minimize' src={minimize_screen} alt="" width="20px"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </>
    )
}

export default Ytplayer