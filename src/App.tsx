import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Layout from "./components/app/Layout";
import "remixicon/fonts/remixicon.css";
import Post from "./components/app/Post";
import Dashboard from "./components/app/Dashboard";
import Friends from "./components/app/Friends";
import Videochat from "./components/app/Videochat";
import Chat from "./components/app/Chat";
import Voicecall from "./components/app/Voicecall";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/app" element={<Layout />}>
        <Route path="" element={<Dashboard />} />
        <Route path="posts" element={<Post />} />
        <Route path="friends" element={<Friends />} />
        <Route path="video-chat" element={<Videochat />} />
        <Route path="chat" element={<Chat />} />
        <Route path="voice-call" element={<Voicecall />} />
      </Route>
    </Routes>
  );
};

export default App;
