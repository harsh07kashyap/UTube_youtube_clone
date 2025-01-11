import React, { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import Leftsidebar from "./Leftsidebar";
import axios from "axios";
const backend_url=process.env.REACT_APP_BACKEND_URL

const Profile = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState("");
  const [profilePics, setProfilePics] = useState([]);
  const [error, setError] = useState(null);
  const profilePicContainerRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [videoCount,setVideoCount]=useState(0);

  const handleProfileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    console.log("Selected File:", selectedFile);
    // Generate a preview of the selected image using FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result); // Set the preview as the result of the FileReader
    };

    if (selectedFile) {
      reader.readAsDataURL(selectedFile); // Read the selected file as a data URL
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault(); // Prevent form submission
    if (!file) return;
    const formData = new FormData();
    formData.append("profilePic", file);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${backend_url}/api/profile/upload`, formData, {
        headers: { "auth-token": token },
      });
      fetchProfilePics(); // Refresh profile pictures after upload
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${backend_url}/api/profile/profiledata`,
        {
          headers: { "auth-token": token },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };
  const fetchVideoCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${backend_url}/api/profile/fetchvideocount`,
        {
          headers: { "auth-token": token },
        }
      );
      setVideoCount(response.data.videoCount);
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };

  const fetchProfilePics = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${backend_url}/api/profile/fetchprofilepic`,
        {
          headers: { "auth-token": token },
        }
      );
      setProfilePics(response.data);
    } catch (error) {
      console.error("Error fetching profile pictures:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
    fetchVideoCount();
    fetchProfilePics();
    const handleClick = () => {
      const fileInput = document.getElementById("profilePic");
      if (fileInput) {
        fileInput.click();
      }
    };

    // Check if ref is available and attach the event listener
    if (profilePicContainerRef.current) {
      const currentContainer = profilePicContainerRef.current; // Save current ref

      currentContainer.addEventListener("click", handleClick);

      // Clean up event listener when component unmounts or ref changes
      return () => {
        currentContainer.removeEventListener("click", handleClick);
      };
    }
  }, [profilePicContainerRef]);

  return (
    <>
      {/* <div className="navbar-home"> */}
      <Navbar />
      {/* </div> */}
      <div className="container_new">
        <div className="left-sidebar">
          <Leftsidebar />
        </div>
        <div className="main-content">
          <div className="profileContainer">
            <div className="profileHeader">
              <form method="post" encType="multipart/form-data">
                <div
                  id="profilePicContainer"
                  className="profile-picture-container"
                  onClick={() => document.getElementById("profilePic").click()}
                >
                  {preview ? (
                    <div className="profile-pictures">
                      <div className="profile-picture">
                        <img
                          src={preview}
                          alt="Selected profile"
                          
                        />
                      </div>
                    </div>
                  ) : profilePics.length > 0 ? (
                    <div className="profile-pictures">
                      {profilePics.map((pic, index) => (
                        <div key={index} className="profile-picture">
                          <img src={pic.url} alt={`Profile ${index}`}  title="Click to change profile"/>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="profile-pictures">
                      <div  className="profile-picture">
                      <img
                        
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
                        alt="Default profile"
                       title="Click to change profile"/>
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="profilePic"
                  name="profilePic"
                  onChange={handleProfileChange}
                  style={{ display: "none" }}
                  ref={profilePicContainerRef}
                />
                {file && (
                  <button
                    type="submit"
                    onClick={handleUpload}
                    className="btn btn-primary"
                  >
                    Submit
                  </button>
                )}
              </form>
            </div>
            <div className="profileInfo">
              <h1 className="profileName">{data.name}</h1>
              <p className="profileStats" title="No. of subscribers and video">
                {data.followers} subscribers • {videoCount} videos
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
