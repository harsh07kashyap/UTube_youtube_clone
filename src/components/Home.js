import React from "react";
import Navbar from "./Navbar";
import Leftsidebar from "./Leftsidebar";
import Request from "./Request";
import Suggestedvideo from "./Suggestedvideo";

const Home = () => {
  return (
    <>
      {/* <div> */}
        {/* <div className="navbar-home"> */}
          <Navbar />
        {/* </div> */}
      {/* </div> */}
      <div className="container_new">
        <div className="left-sidebar">
          <Leftsidebar />
        </div>
        <div className="main-content">
          {localStorage.getItem("token") ? (
            <Suggestedvideo className="suggested-video" />
          ) : (
            <Request className="request" />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
