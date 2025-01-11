import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Ytplayer from "./Ytplayers";
// import styles from './Ytplayer.module.css';
// import { myScriptFunction } from './Ytplayer.script';
const backend_url=process.env.REACT_APP_BACKEND_URL

const VideoPlayer = () => {
  const { id } = useParams();
  const [videos, setVideos] = useState(null);
  const [newcomment, setNewcomment] = useState("");
  const [commentbox, setCommentbox] = useState(" ");
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `${backend_url}/api/homeContent/fetchvideos/${id}`
        );
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideos();
    const fetchcomments = async () => {
      try {
        const response = await axios.get(
          `${backend_url}/api/videoplayer/comments/${id}`
        );
        const data = await response.data;
        setCommentbox(data);
      } catch (error) {
        console.error("error fetcing comments", error);
      }
    };
    fetchcomments();

    const fetchLikeStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${backend_url}/api/videoplayer/like_status/${id}`,
          {
            method: "GET",
            // credentials: 'include',
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          }
        );
        const data = await response.json();
        setHasLiked(data.hasLiked);
        setLikesCount(data.likes);
      } catch (error) {
        console.error("error fetcing comments", error);
      }
    };

    fetchLikeStatus();
  }, [id]);
  if (!videos) {
    return <div>Loading...</div>;
  }

  const toggleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${backend_url}/api/videoplayer/likes/${id}`,
        {
          method: "POST",
          // credentials: 'include', // For cookies or sessions
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );
      const data = await response.json();
      setHasLiked(!hasLiked);
      setLikesCount(data.likes);
    } catch (error) {
      console.error("Error liking the video:", error);
    }
  };

  const handleChange = async (e) => {
    try {
      e.preventDefault();
      const commentData = {
        comment: newcomment,
      };
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${backend_url}/api/videoplayer/videos/${id}/comment`,
        {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify(commentData), // body data type must match "Content-Type" header
        }
      );
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error("Error collecting comment details:", error);
    }
  };

  const onChange = (e) => {
    setNewcomment(e.target.value);
  };

  return (
    <>
      
        {/* <div className="suggested-video"> */}
          {/* <div className="card" style={{ width: "25rem" }}> */}
            {/* <video width="240" height="240" controls>
                           <source src={`http://localhost:5000/uploads/videos/${videos.filename}`} type="video/mp4" />
                           Your browser does not support the video tag.
            </video> */}
            <Ytplayer videos={videos} />

            <div className="card-body">
              <h5 className="card-title">{videos.title}</h5>
              <p className="card-text">{videos.description}</p>
              <button
                style={{ color: hasLiked ? "blue" : "gray" }}
                onClick={toggleLike}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-hand-thumbs-up"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
                </svg>
                {likesCount}
              </button>
              {/* <p onClick={()=>onClickComment()}> Comment </p> */}
            </div>
            <form onSubmit={handleChange}>
              <input
                type="text"
                onChange={onChange}
                value={newcomment}
                id="comment"
                name="comment"
              />
              <button type="submit">Submit</button>
            </form>
          {/* </div> */}
          <div>
            <h3>Comments</h3>
            {commentbox.comments && commentbox.comments.length > 0 ? (
              <ul>
                {commentbox.comments.map((comment) => (
                  <li key={comment._id}>
                    <strong>{comment.user.name}:</strong> {comment.text} <br />
                    <small>{new Date(comment.date).toLocaleString()}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        {/* </div> */}
      
    </>
  );
};

export default VideoPlayer;
