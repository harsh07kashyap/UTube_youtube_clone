
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Alert from './components/Alert';
import Signup from './components/Signup';
import Login from './components/Login';
import CreatePost from "./components/CreatePost"
import VideoPlayer from "./components/VideoPlayer"
import Profile from "./components/Profile"
import Channel from "./components/Channel"
import { useState } from 'react';

function App() {
  // const [alert,setAlert]=useState(null);
  
  // const showAlert=(message,type)=>{
  //   setAlert({
  //     msg:message,
  //     type:type
  //   })
  //   setTimeout(() => {
  //     setAlert(null)
  //   }, 2000);
  // }
  
  return (
    <>
      <Router>
      {/* <Alert alert={alert} /> */}
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<Signup />} />
          <Route path="/createpost" exact element={<CreatePost/>} />
          <Route path="/videoplayer/:id" exact element={<VideoPlayer/> } />
          <Route path="/profile" exact element={<Profile/>} />
          <Route path="/channel/:userid" exact element={<Channel/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
