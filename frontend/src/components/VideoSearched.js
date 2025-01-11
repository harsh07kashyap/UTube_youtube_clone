import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Leftsidebar from "./Leftsidebar";
import Request from "./Request";
import Suggestedvideo from "./Suggestedvideo";
const backend_url=process.env.REACT_APP_BACKEND_URL

const VideoSearch = () => {
  // let navigate=useNavigate();
  const { query } = useParams();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(
          `${backend_url}/api/searchbar/getsearchvideos/${query}`
        );
        // console.log(response.data)
        setVideos(response.data); // Array of videos
      } catch (error) {
        console.error("Error fetching search results:", error);
        return [];
      }
    };

    if (query) {  // Ensure query exists before making the request
      fetchSearchResults();
    }
  }, [query]);

  return (
    <>
      <Navbar/>
      <div className="container_new">
        <div className="left-sidebar">
            <Leftsidebar />
        </div>
        <div className="main-content">
          <div className="video-list">
            {videos.map((video) => (
              <div
                key={video._id}
                className="video-card"
                style={{ width: "18rem" }}
              >
                <video width="280" height="240" controls>
                  <source
                    src={`${backend_url}/uploads/videos/${video.filename}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
                <div className="card-body">
                  <h5 className="card-title">{video.title}</h5>
                  <p className="card-text">{video.description}</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="20"
                    height="20"
                    viewBox="0 0 30 30"
                  >
                    <path
                      d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"
                      className="delete-button"
                    ></path>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoSearch;
