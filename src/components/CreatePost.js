import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar"
// import {Link} from "react-router-dom"
// import ReactPlayer from 'react-player'
// import videoUrl from "../../backend/uploads/1720522067889-0b454c97475de19eacc1fca3884ae85c.mp4"

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videos, setVideos] = useState([]);

  const handleVideoChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleThumbnailChange = (event) => {
    setThumbnail(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault(); // Prevent form submission
    const formData = new FormData();
    formData.append("video", file);
    formData.append("thumbnail", thumbnail);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/posts/upload", formData, {
        headers: { "auth-token": token },
      });
      fetchVideos();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVideos = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:5000/api/posts/videos", {
      headers: { "auth-token": token },
    });
    setVideos(response.data);
  };

  const deletepost = async (id) => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `http://localhost:5000/api/posts/deletepost/${id}`,
      {
        headers: { "auth-token": token },
      }
    );
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <>
      <Navbar/>
      <div className="create-post-container">
        <form
          className="create-post-form"
          method="post"
          encType="multipart/form-data"
        >
          <h1>Upload Video</h1>
          <input
            type="file"
            id="video"
            name="video"
            onChange={handleVideoChange}
          />
          {/* <button onClick={handleUpload}>Upload</button> */}
          <h1>Upload Thumbnail</h1>
          <input
            type="file"
            id="thumbnail"
            name="thumbnail"
            onChange={handleThumbnailChange}
          />
          <div className="form-group">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Title:
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-describedby="emailHelp"
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Description
            </label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button
            type="submit"
            onClick={handleUpload}
            className="btn btn-primary"
          >
            Submit
          </button>
        </form>
      </div>
      <h2>Your Videos</h2>

      <div className="video-list">
        
          {videos.map((video) => (
            <div
              key={video._id}
              className="video-card"
              style={{ width: "18rem" }}
            >
              <video width="280" height="240" controls>
                <source
                  src={`http://localhost:5000/uploads/videos/${video.filename}`}
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
                    onClick={() => deletepost(video._id)}
                  ></path>
                </svg>
              </div>
            </div>
          ))}
        
      </div>
    </>
  );
};

export default CreatePost;
