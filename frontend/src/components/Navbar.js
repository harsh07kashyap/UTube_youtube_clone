import React,{useEffect,useState} from 'react'
import {Link,useNavigate} from "react-router-dom"
import axios from "axios";
import BookData from "../Data.json";
import SearchBar from "./Searchbar";
const backend_url=process.env.REACT_APP_BACKEND_URL

const Navbar = () => {
    const [profilePics, setProfilePics] = useState([]);
    const [error, setError] = useState(null);
    let navigate=useNavigate();
    const handleLogout=()=>{
      localStorage.removeItem('token');
      navigate("/login")
    }
    const fetchProfilePics = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${backend_url}/api/profile/fetchprofilepic`, {
          headers: { "auth-token": token },
        });
        setProfilePics(response.data);
      } catch (error) {
        console.error("Error fetching profile pictures:", error);
        setError(error.message);
      }
    };

  useEffect(() => {
    fetchProfilePics();
  }, []);

  
  return (
    // <div>
      <nav className="navbar">
        <div className="navbar-left">
            <button id="menu-btn" className="menu-btn">
                <img src="https://www.gstatic.com/images/icons/material/system/2x/menu_black_24dp.png" alt="Menu"/>
            </button>
            <Link to="/" className="logo">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" alt="YouTube Logo"/>
            </Link>
        </div>
        <div className="navbar-center">
            <SearchBar/>
            {/* <button className="search-btn"> */}
                {/* <img src="https://www.gstatic.com/images/icons/material/system/2x/search_white_24dp.png" alt="Search"/> */}
            {/* </button> */}
            </div>
        <div className="navbar-right">
            {!localStorage.getItem('token')? <form className="d-flex_own" role="search">
            <Link className="btn btn-primary" to="/login" title="Login in your account" role="button">Login</Link>
            <Link className="btn btn-primary" to="/signup" title="Register Account"  role="button">SignUp</Link>
            </form> : <form className="d-flex" role="search"> <Link to="/createpost" className="create-btn" role="button">
                <img src="https://www.gstatic.com/images/icons/material/system/2x/videocam_black_24dp.png" title="Upload Post" alt="Create"/>
            </Link>  <button className='btn btn-primary' onClick={handleLogout} title="Logout" >LOGOUT</button> </form> }
            {/* <Link to="/createpost" className="create-btn" role="button">
                <img src="https://www.gstatic.com/images/icons/material/system/2x/videocam_white_24dp.png" alt="Create"/>
            </Link> */}
            {/* <button className="create-btn">
                <img src="https://www.gstatic.com/images/icons/material/system/2x/videocam_white_24dp.png" alt="Create"/>
            </button> */}
            <Link to="/profile"> {profilePics.length > 0 ? (
                <div className="profile-pictures">
                  {profilePics.map((pic, index) => (
                    <div key={index} className="profile-picture">
                      <img style={{ width: "43px", height: "35px" }} title="Create Profile" src={pic.url} alt={`Profile ${index}`} />
                    </div>
                  ))}
                </div>
              ) : (
                <div><img style={{ width: "35px", height: "35px" }} title="Create Profile" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png" alt="" /></div>
              )} </Link>
        </div>
    </nav>
    // </div>
  )
}

export default Navbar
