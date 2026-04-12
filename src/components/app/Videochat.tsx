import { useContext, useEffect, useRef, useState } from "react";
import { Catcherr } from "../lib/CatchError";
import Button from "../shared/Button";
import Context from "../../Context";
import { toast } from "react-toastify";
import socket from "../lib/socket";
import { useParams } from "react-router-dom";
import { notification } from "antd";

const Videochat = () => {
  const { session } = useContext(Context);
  const { id } = useParams();
  const [notify, notifyUi] = notification.useNotification();

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoContainerRef = useRef<HTMLDivElement | null>(null);
  const remoteVideoContainerRef = useRef<HTMLDivElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  // const rtcRef = useRef<PeerConnection | null>(null);
  const rtcRef = useRef<RTCPeerConnection | null>(null);

  const [isLocalVideoSharing, setIsLocalVideoSharing] = useState(false);
  const [isLocalScreenSharing, setIsLocalScreenSharing] = useState(false);
  const [isMic, setIsMic] = useState(false);

  const config = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const toggleVideo = async () => {
    try {
      const localVideo = localVideoRef.current;

      if (!localVideo) return;

      if (!isLocalVideoSharing) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localVideo.srcObject = stream;
        localStreamRef.current = stream;

        const audio = new Audio();
        audio.srcObject = stream;
        audio.muted = false; // optional
        audio.play().catch(() => {}); // ✅ ADD (autoplay error avoid)

        setIsLocalVideoSharing(true);
        setIsMic(true);
      } else {
        const localStream = localStreamRef.current;
        if (!localStream) return;

        localStream.getTracks().forEach((track) => {
          track.stop();
        });

        setIsLocalVideoSharing(false);
        setIsMic(false);
      }
    } catch (err) {
      Catcherr(err);
    }
  };

  const toggleMic = () => {
    try {
      const localStream = localStreamRef.current;

      if (!localStream) {
        console.log("❌ No local stream"); // ✅ ADDED
        return;
      }

      const audioTrack = localStream
        .getTracks()
        .find((tracks) => tracks.kind === "audio");

      // console.log("❌ No audio track"); // ✅ ADDED
      // return;
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;

        setIsMic(audioTrack.enabled);
      }
    } catch (err) {
      Catcherr(err);
    }
  };

  const toggleScreen = async () => {
    try {
      const localVideo = localVideoRef.current;

      if (!localVideo) return;

      if (!isLocalScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        localVideo.srcObject = stream;
        localStreamRef.current = stream;
        setIsLocalScreenSharing(true);
      } else {
        const localStream = localStreamRef.current;

        if (!localStream) return;

        // here we check the track and stop it and release the data 
        localStream.getTracks().forEach((track) => {
          track.stop();
        });
        localVideo.srcObject = null;
        localVideoRef.current = null;
        setIsLocalScreenSharing(false);
      }
    } catch (err) {
      Catcherr(err);
    }
  };

  const toggleFullScreen = (type: "local" | "remote") => {
    try {
      if (!isLocalVideoSharing && !isLocalScreenSharing)
        return toast.error("please start your video first", {
          position: "top-center",
        });

      const VideoContainer =
        type === "local"
          ? localVideoContainerRef.current
          : remoteVideoContainerRef.current;

      if (!VideoContainer) return;

      if (!document.fullscreenElement) {
        VideoContainer.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    } catch (err) {
      Catcherr(err);
    }
  };

  const webrtcConnection = () => {
    rtcRef.current = new RTCPeerConnection(config);

    const localStream = localStreamRef.current;

    if (!localStream) return;

    // const rtcRef.current = rtcRef.currentRef.current;
    rtcRef.current.onicecandidate = (e) => {
      console.log(e.candidate); //here we find connected user ip and port
    };

    rtcRef.current.onconnectionstatechange = () => {
      console.log(rtcRef.current?.connectionState); // check how many user are connected
    };

    rtcRef.current.ontrack = () => {
      console.log("something is comming from remote user");
    };

    localStream.getTracks().forEach((track) => {
      rtcRef.current?.addTrack(track, localStream);
    });
  };

  const StartCall = async () => {
    try {
      if (!isLocalVideoSharing && !isLocalScreenSharing) {
        toast.error("please start video first ", { position: "top-center" });
      }

      webrtcConnection();

      if (!rtcRef.current) return;

      const offer = await rtcRef.current.createOffer(); //create offer and sdp to user 2
      await rtcRef.current.setLocalDescription(offer);
      socket.emit("offer", { offer, to: id });
    } catch (err) {
      Catcherr(err);
    }
  };

  const EndCall = () => {
    try {
      alert("end call");
    } catch (err) {
      Catcherr(err);
    }
  };

  const onOffer = (payload: any) => {
    // console.log(payload);
    notify.open({
      message: "Er Saurav",
      description: "Incoming Call",
      duration: 30,
    });
  };

  useEffect(() => {
    socket.on("offer", onOffer);

    return () => {
      socket.on("offer", onOffer);
    };
  }, []);

  return (
    <div className="p-2 space-y-6">
      <div
        ref={remoteVideoContainerRef}
        className="w-full h-0 relative pb-[56.25%] bg-black overflow-hidden rounded-xl"
      >
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full absolute top-0 left-0 object-contain"
        ></video>
        <button className="bg-white/10 px-3 py-2 text-xs rounded-lg text-white absolute bottom-5 left-5">
          Saurav Kumar
        </button>
        <button
          onClick={() => toggleFullScreen("remote")}
          className="bg-white/10 px-3 py-2 text-xs rounded-lg text-white absolute bottom-5 right-5 transition-all duration-150 hover:scale-110"
        >
          <i className="ri-fullscreen-exit-line"></i>
        </button>
      </div>

      {/* mutiple user video */}
      <div className="grid grid-cols-3 gap-4 ">
        <div
          ref={localVideoContainerRef}
          className="w-full h-0 relative pb-[56.25%] bg-black overflow-hidden  rounded-xl"
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            className="w-full h-full absolute top-0 left-0 object-contain"
          ></video>
          <button className="bg-white/10 capitalize cursor-pointer px-3 py-2 text-xs rounded-lg text-white absolute bottom-5 left-5">
            {session && session.fullname}
          </button>
          <button
            onClick={() => toggleFullScreen("local")}
            className="bg-black/50 cursor-pointer px-3 py-2 text-xs rounded-lg text-white absolute bottom-5 right-5 transition-all duration-150 hover:scale-110"
          >
            <i className="ri-fullscreen-exit-line"></i>
          </button>
        </div>
        <Button icon="user-add-line">Add</Button>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-5">
          <button
            onClick={toggleMic}
            className="w-12 h-12 rounded-full bg-amber-500 text-white hover:bg-amber-400"
          >
            {isMic ? (
              <i className="ri-mic-line"></i>
            ) : (
              <i className="ri-mic-off-line"></i>
            )}
          </button>
          <button
            onClick={toggleVideo}
            className="w-12 h-12 rounded-full bg-violet-500 text-white hover:bg-violet-400"
          >
            {isLocalVideoSharing ? (
              <i className="ri-video-on-line"></i>
            ) : (
              <i className="ri-video-off-line"></i>
            )}
          </button>
          <button
            onClick={toggleScreen}
            className="w-12 h-12 rounded-full bg-blue-500 text-white hover:bg-blue-400"
          >
            {isLocalScreenSharing ? (
              <i className="ri-tv-2-line"></i>
            ) : (
              <i className="ri-chat-off-line"></i>
            )}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={StartCall} icon="phone-fill" type="success">
            Call
          </Button>
          <Button onClick={EndCall} icon="close-circle-line" type="danger">
            End
          </Button>
        </div>
      </div>
      {notifyUi}
    </div>
  );
};
export default Videochat;
