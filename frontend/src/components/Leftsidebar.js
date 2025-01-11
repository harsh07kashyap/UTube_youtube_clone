import React from 'react'
import {Link} from "react-router-dom"



const Leftsidebar = () => {
  return (


    <>
    {/* <div className="container-leftsidebar"> */}
        <div className="sidebar">
            <Link to="#" className="sidebar-item">
                <img src="https://www.gstatic.com/images/icons/material/system/2x/home_black_24dp.png" alt="Home"/>
                <span>Home</span>
            </Link>
            <Link to="#" className="sidebar-item">
                <img src="https://www.gstatic.com/images/icons/material/system/2x/explore_black_24dp.png" alt="Explore"/>
                <span>Explore</span>
            </Link>
            <Link to="#" className="sidebar-item">
                <img src="https://www.gstatic.com/images/icons/material/system/2x/subscriptions_black_24dp.png" alt="Subscriptions"/>
                <span>Subscriptions</span>
            </Link>
            <Link to="#" className="sidebar-item">
                <img src="https://www.gstatic.com/images/icons/material/system/2x/video_library_black_24dp.png" alt="Library"/>
                <span>Library</span>
            </Link>
            <Link to="#" className="sidebar-item">
                <img src="https://www.gstatic.com/images/icons/material/system/2x/history_black_24dp.png" alt="History"/>
                <span>History</span>
            </Link>
        </div>
        <main>
        </main>
     {/* </div> */}
    </>
  )
}

export default Leftsidebar
