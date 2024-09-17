import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Leftsidebar from "./Leftsidebar";
import { useParams } from 'react-router-dom';
import axios from "axios";
import styles from './Channel.module.css';
import Subscribe from "./Subscribe"

const Profile = () => {
//   const [file, setFile] = useState(null);
  const { userid } = useParams();
  const [data, setData] = useState('');
  const [profilePics, setProfilePics] = useState([]);
  const [error, setError] = useState(null);
  const [videoCount,setVideoCount]=useState(0);
  // const [subscribersCount, setSubscribersCount] = useState(() => Number(initialSubscribersCount) || 0);

  useEffect(() => {

    const fetchData = async () => {
      try {
        // const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/channel/profiledata/${userid}`);
        setData(response.data);
        console.log(response.data.followers)
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
  
    const fetchProfilePics = async () => {
      try {
        // const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/channel/fetchprofilepic/${userid}`);
        setProfilePics(response.data);
      } catch (error) {
        console.error("Error fetching profile pictures:", error);
        setError(error.message);
      }
    };

    const fetchVideoCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          (`http://localhost:5000/api/profile/fetchvideocount/${userid}`),
          {
            headers: { "auth-token": token },
          }
        );
        setVideoCount(response.data.videoCount);
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    fetchData();
    fetchProfilePics();
    fetchVideoCount();
  }, [userid]);

  return (
    <>
      <div className={styles.navbarhome}>
        <Navbar />
      </div>
      <div className={styles.container}>
        <div className={styles.leftsidebar}>
          <Leftsidebar />
        </div>
        <div className={styles.maincontentprofile}>
          <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
              
              {profilePics.length > 0 ? (
                <div className={styles.profilepictures}>
                  {profilePics.map((pic, index) => (
                    <div key={index} className={styles.profilepicture}>
                      <img src={pic.url} alt={`Profile ${index}`} />
                    </div>
                  ))}
                </div>
              ) : (
                <div>No profile pictures available.</div>
              )}
            </div>
            <div className={styles.profileInfo}>
              <h1 className={styles.profileName}>{data.name}</h1>
              <p className={styles.profileStats}> {data.followers}subscribers • {videoCount} videos</p>
              <Subscribe userId={userid} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
