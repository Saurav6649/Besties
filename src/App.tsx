import { Route, Routes } from "react-router-dom";
import 'font-awesome/css/font-awesome.min.css'
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Layout from "./components/app/Layout";
import "remixicon/fonts/remixicon.css";
import Post from "./components/app/Post";
import Dashboard from "./components/app/Dashboard";
import Videochat from "./components/app/Videochat";
import Chat from "./components/app/Chat";
import Voicecall from "./components/app/Voicecall";
import Notfound from "./components/Notfound";
import { ToastContainer } from "react-toastify";
import Guard from "./guards/Guard";
import { useState } from "react";
import Context, { type SessionType } from "./Context";
import RedirectGuard from "./guards/RedirectGuard";
import FriendList from "./components/app/friend/FriendList";

const App = () => {
  const [session, setSession] = useState<SessionType | null | false>(null);
  return (
    <>
      <Context.Provider value={{ session, setSession }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<RedirectGuard />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          <Route element={<Guard />}>
            <Route path="/app" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="posts" element={<Post />} />
              <Route path="friends" element={<FriendList />} />
              <Route path="video-chat" element={<Videochat />} />
              <Route path="chat/:id" element={<Chat />} />
              <Route path="voice-call" element={<Voicecall />} />
            </Route>
          </Route>

          <Route path="*" element={<Notfound />} />
        </Routes>

        {/* ✅ Yaha rakho */}
        <ToastContainer />
      </Context.Provider>
    </>
  );
};

export default App;
