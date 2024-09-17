import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
// import styles from './Channel.module.css';

const Suggestedvideo = ({ thumbnail }) => {
  const [images, setImages] = useState([]);

  const fetchThumbnails = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/homeContent/fetchthumbnails"
      );
      console.log("Fetched Thumbnails Data:", response.data);
      setImages(response.data);
    } catch (error) {
      console.error("Error fetching thumbnails:", error);
    }
  };

  useEffect(() => {
    fetchThumbnails();
    // fetchProfilePics();
  }, []);

  let navigate = useNavigate();

  const onClick = async (videoId, currentViews) => {
    try {
      navigate(`/videoplayer/${videoId}`);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const newViews = currentViews + 1;
      console.log(`Updating views for videoId: ${videoId} to ${newViews}`); // Debug log

      const response = await axios.put(
        `http://localhost:5000/api/homeContent/updateViews/${videoId}`,
        { views: newViews },
        {
          headers: {
            "auth-token": token,
          },
        }
      );

      if (response.status === 200) {
        console.log(`Views updated successfully for videoId: ${videoId}`); // Debug log

        // Update the views in the local state
        setImages((prevImages) =>
          prevImages.map((image) =>
            image.videoId === videoId ? { ...image, views: newViews } : image
          )
        );
      } else {
        console.error(`Failed to update views for videoId: ${videoId}`); // Debug log
      }
    } catch (error) {
      console.error("Error updating views:", error);
    }
  };

  const onClickName = async (userid) => {
    try {
      navigate(`/channel/${userid}`);
    } catch (error) {
      console.error("Error opening channel details:", error);
    }
  };

  return (
    <>
      {/* <div className="suggested-video"> */}
      {/* <ul > */}
      {images.map((image) => (
        <div key={image._id} className="card_own" style={{ width: "250px" }}>
          <img
            onClick={() => onClick(image.videoId, image.views)}
            src={`http://localhost:5000/uploads/images/${image.filename}`}
            alt={`http://localhost:5000/uploads/images/${image.filename}`}
          ></img>
          <div className="card-body">
            <div className="card-body-one">
              {image.profilePicture ? (
                <img
                  style={{ width: "32px", height: "32px", borderRadius: "50%" }}
                  src={`http://localhost:5000/uploads/profiles/${image.profilePicture}`} // Fetch from server
                  alt="Profile"
                />
              ) : (
                <img
                  style={{ width: "32px", height: "32px", borderRadius: "50%" }}
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png" // Default profile picture
                  alt="Default Profile"
                />
              )}
            </div>
            <div className="card-body-two">
              <h5 className="card-title">{image.title}</h5>
              <p onClick={() => onClickName(image.userid)} className="card-text">
                {image.channelName}
              </p>
              <p className="card-text-views">{image.views} views</p>
            </div>
          </div>
        </div>
      ))}
      {/* </ul> */}
      {/* </div> */}
    </>
  );
};

export default Suggestedvideo;
