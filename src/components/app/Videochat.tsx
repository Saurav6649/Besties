import { useContext, useEffect, useRef, useState } from "react";
import { Catcherr } from "../lib/CatchError";
import Button from "../shared/Button";
import Context from "../../Context";
import { toast } from "react-toastify";
import socket from "../lib/socket";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, notification } from "antd";
import SmallButton from "../shared/SmallButton";
import HttpInterceptor from "../lib/HttpInterceptor";

export interface OnOfferInterface {
  offer: RTCSessionDescriptionInit;
  from: any;
}

interface OnAnswerInterface {
  answer: RTCSessionDescriptionInit;
  from: string;
}

interface IceCandidateInterface {
  candidate: RTCIceCandidate;
  from: string;
}

const Videochat = () => {
  const { session, liveActiveSession, sdp, setSdp } = useContext(Context);
  const { id } = useParams();
  const [notify, notifyUi] = notification.useNotification();

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoContainerRef = useRef<HTMLDivElement | null>(null);
  const remoteVideoContainerRef = useRef<HTMLDivElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  // const rtcRef = useRef<PeerConnection | null>(null);
  const rtcRef = useRef<RTCPeerConnection | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);

  type callType = "pending" | "calling" | "incoming" | "talking" | "end";
  type AudioSrcType = "/sound/Calling.mp3" | "/sound/end.mp3";

  function formatCallTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");

    return `${hrs}:${mins}:${secs}`;
  }

  const [isLocalVideoSharing, setIsLocalVideoSharing] = useState(false);
  const [isLocalScreenSharing, setIsLocalScreenSharing] = useState(false);
  const [isMic, setIsMic] = useState(false);
  const [status, setStatus] = useState<callType>("pending");
  const [timer, setTimer] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const config = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const stopAudio = () => {
    if (!audio.current) return;

    const player = audio.current;
    player.pause();
    player.currentTime = 0;
  };

  const playAudio = (src: AudioSrcType, loop: boolean = false) => {
    // ✅ always stop previous
    if (audio.current) {
      audio.current.pause();
      audio.current.currentTime = 0;
    }

    // ✅ always create new audio (IMPORTANT)
    const player = new Audio(src);
    player.loop = loop;

    audio.current = player;

    player
      .play()
      .then(() => console.log("🔊 Playing:", src))
      .catch((err) => console.log("❌ Audio blocked:", err));
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

        // ✅ FIX 1: correct track
        const shareScreenTrack = stream.getVideoTracks()[0];

        const sendVideoTrack = rtcRef.current
          ?.getSenders()
          .find((s) => s.track?.kind === "video");

        if (shareScreenTrack && sendVideoTrack) {
          await sendVideoTrack.replaceTrack(shareScreenTrack);
        }

        localVideo.srcObject = stream;
        localStreamRef.current = stream;
        setIsLocalScreenSharing(true);

        // ✅ detect screen sharing off (browser button)
        shareScreenTrack.onended = async () => {
          console.log("🛑 screen stopped");

          setIsLocalScreenSharing(false);

          // ✅ FIX 2: camera wapas lao
          const videoCamStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });

          const videoTrack = videoCamStream.getVideoTracks()[0];

          const senderTrack = rtcRef.current
            ?.getSenders()
            .find((s) => s.track?.kind === "video");

          if (videoTrack && senderTrack) {
            await senderTrack.replaceTrack(videoTrack);
          }

          localVideo.srcObject = videoCamStream;
          localStreamRef.current = videoCamStream;
          setIsLocalVideoSharing(true);
        };
      } else {
        const localStream = localStreamRef.current;
        if (!localStream) return;

        // stop screen tracks
        localStream.getTracks().forEach((track) => track.stop());

        // ✅ FIX 3: camera wapas lao manually bhi
        const videoCamStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        const videoTrack = videoCamStream.getVideoTracks()[0];

        const senderTrack = rtcRef.current
          ?.getSenders()
          .find((s) => s.track?.kind === "video");

        if (videoTrack && senderTrack) {
          await senderTrack.replaceTrack(videoTrack);
        }

        localVideo.srcObject = videoCamStream;
        localStreamRef.current = videoCamStream;

        setIsLocalScreenSharing(false);

        // ❌ REMOVE THIS (IMPORTANT)
        // localVideoRef.current = null;
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

  const webrtcConnection = async () => {
    const { data } = await HttpInterceptor.get("/twilio/turn-server");

    rtcRef.current = new RTCPeerConnection({ iceServers: data });

    const localStream = localStreamRef.current;

    if (!localStream) return;

    // const rtcRef.current = rtcRef.currentRef.current;
    rtcRef.current.onicecandidate = (e) => {
      //here we find connected user ip and port

      if (e.candidate) {
        socket.emit("candidate", { candidate: e.candidate, to: id });
      }
    };

    rtcRef.current.onconnectionstatechange = () => {
      console.log(rtcRef.current?.connectionState); // check how many user are connected
    };

    rtcRef.current.ontrack = (e) => {
      const remoteStream = e.streams[0];
      const remoteVideo = remoteVideoRef.current;

      if (!remoteVideo) return;
      // if (!remoteStream || !remoteVideo) return;

      remoteVideo.srcObject = remoteStream;

      // const videoTrack = remoteStream.getVideoTracks()[0];
      // if (videoTrack) {
      //   videoTrack.onmute = () => {
      //     console.log("video off ------------------------");
      //     remoteVideo.srcObject = null;
      //     remoteVideo.style.display = "none";
      //   };

      //   videoTrack.onunmute = () => {
      //     console.log("video on ------------------------");
      //     remoteVideo.srcObject = remoteStream
      //     remoteVideo.style.display = "block";
      //   };

      //   videoTrack.onended = () => {
      //     remoteVideo.srcObject = null;
      //     remoteVideo.style.display = "none";
      //   };
      // }

      const videoTrack = remoteStream.getVideoTracks()[0];

      if (videoTrack) {
        const updateVideoState = () => {
          if (!videoTrack.enabled) {
            console.log("video off");

            remoteVideo.srcObject = null;
            remoteVideo.style.display = "none";
          } else {
            console.log("video on");

            remoteVideo.srcObject = remoteStream;
            remoteVideo.style.display = "block";
          }
        };

        // initial check
        updateVideoState();

        videoTrack.onended = () => {
          remoteVideo.srcObject = null;
          remoteVideo.style.display = "none";
        };
      }
    };

    localStream.getTracks().forEach((track) => {
      rtcRef.current?.addTrack(track, localStream);
    });
  };

  const StartCall = async () => {
    try {
      console.log("📞 StartCall clicked"); // ✅ DEBUG

      if (!isLocalVideoSharing && !isLocalScreenSharing) {
        toast.error("please start video first ", { position: "top-center" });
      }

      await webrtcConnection();

      if (!rtcRef.current) return;

      // 1. create offer
      const offer = await rtcRef.current.createOffer();
      await rtcRef.current.setLocalDescription(offer);

      setStatus("calling");
      playAudio("/sound/Calling.mp3", true);

      // 🔥 PLAY SOUND HERE (user interaction fix)
      if (!audio.current) {
        audio.current = new Audio("/sound/Calling.mp3");
        audio.current.loop = true;
        console.log("🎵 Audio created in StartCall");
      }

      audio.current
        .play()
        .then(() => console.log("🔊 Playing from StartCall"))
        .catch((err) => console.log("❌ Audio blocked:", err));

      notify.open({
        title: <h1 className="capitalize">{liveActiveSession.fullname}</h1>,
        description: "Calling....",
        duration: 30,
        placement: "bottomRight",
        onClose: stopAudio,
        actions: [
          <div key="calls">
            <Button
              key="calls"
              onClick={endCallFromLocal}
              icon="phone-fill"
              type="danger"
            >
              End Call
            </Button>
          </div>,
        ],
      });

      // 2. send offer via signaling
      socket.emit("offer", { offer, to: id, from: session });
    } catch (err) {
      Catcherr(err);
    }
  };

  const onOffer = (payload: OnOfferInterface) => {
    console.log("📩 Incoming offer:", payload); // ✅ DEBUG

    setStatus("incoming");

    // 🔥 play sound for incoming
    if (!audio.current) {
      audio.current = new Audio("/sound/Calling.mp3");
      audio.current.loop = true;
      console.log("🎵 Audio created in Incoming");
    }

    audio.current
      .play()
      .then(() => console.log("🔊 Incoming sound playing"))
      .catch((err) => console.log("❌ Audio blocked:", err));

    notify.open({
      title: payload.from.fullname,
      description: "Incoming Call",
      duration: 30,
      actions: [
        <div key="calls">
          <SmallButton
            onClick={() => accept(payload)}
            icon="phone-fill"
            type="success"
          >
            Accept
          </SmallButton>
          ,
          <SmallButton
            onClick={endCallFromLocal}
            icon="phone-fill"
            type="danger"
          >
            End Call
          </SmallButton>
        </div>,
      ],
    });
  };

  const accept = async (payload: OnOfferInterface) => {
    try {
      setSdp(null);

      await webrtcConnection();

      if (!rtcRef.current) return;

      const offer = new RTCSessionDescription(payload.offer);
      await rtcRef.current.setRemoteDescription(offer);

      const answer = await rtcRef.current.createAnswer(); // it gives sdp means user accpet kar ke loged data dega
      await rtcRef.current.setLocalDescription(answer);

      notify.destroy();
      setStatus("talking");
      stopAudio();

      socket.emit("answer", { answer, to: id });
    } catch (err) {
      Catcherr(err);
    }
  };

  const endStreaming = () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());

    if (localVideoRef.current) localVideoRef.current.srcObject = null;

    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  const redirectOnCallEnd = () => {
    setOpen(false);
    navigate("/app");
  };

  const endCallFromLocal = () => {
    try {
      setStatus("end");

      playAudio("/sound/end.mp3", false); // ✅ loop false

      socket.emit("end", { to: id });
      notify.destroy();
      endStreaming();
      setOpen(true);
    } catch (err) {
      Catcherr(err);
    }
  };

  const onEndCallRemote = () => {
    setStatus("end");

    playAudio("/sound/end.mp3", false); // ✅ loop false

    notify.destroy();
    endStreaming();
    setOpen(true);
  };

  // 3 connect user by onCadidate function
  const onCandidate = async (payload: IceCandidateInterface) => {
    try {
      if (!rtcRef.current) return;

      const candidate = new RTCIceCandidate(payload.candidate);
      await rtcRef.current.addIceCandidate(candidate);
    } catch (err) {
      Catcherr(err);
    }
  };

  const OnAnswer = async (payload: OnAnswerInterface) => {
    try {
      if (!rtcRef.current) return;

      const answer = await new RTCSessionDescription(payload.answer);
      await rtcRef.current.setRemoteDescription(answer);

      setStatus("talking");
      formatCallTime(timer);
      stopAudio();

      notify.destroy();
    } catch (err) {
      Catcherr(err);
    }
  };

  useEffect(() => {
    socket.on("offer", onOffer);
    socket.on("candidate", onCandidate);
    socket.on("answer", OnAnswer);
    socket.on("end", onEndCallRemote);

    return () => {
      socket.on("offer", onOffer);
      socket.off("candidate", onCandidate);
      socket.off("answer", OnAnswer);
      socket.on("end", onEndCallRemote);
    };
  }, []);

  useEffect(() => {
    let interval: any;

    if (status === "talking") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [status]);

  // // useEffect(() => {
  // //   if (status === "pending") return;

  // //   if (!audio.current) return;

  // //   audio.current = new Audio();

  // //   if (status === "calling" || status === "incoming") {
  // //     audio.current.pause();
  // //     audio.current.src = "/sound/Calling.mp3";
  // //     // audio.current.src =
  // //     //   status === "calling" ? "/sound/Calling.mp3" : "/sound/Ringing.mp3";
  // //     audio.current.currentTime = 0;
  // //     audio.current.load();
  // //     audio.current.play();
  // //   }
  // // }, []);

  // useEffect(() => {
  //   console.log("🔥 STATUS CHANGED:", status);

  //   let interval: any;

  //   if (status === "pending") return;

  //   // audio create once
  //   if (!audio.current) {
  //     audio.current = new Audio("/sound/Calling.mp3");
  //     audio.current.loop = true;
  //   }

  //   if (status === "calling" || status === "incoming") {
  //     audio.current.currentTime = 0;

  //     audio.current
  //       .play()
  //       .catch((err) => console.log("❌ Audio blocked:", err));
  //   }

  //   // ✅ FIX 1: ONLY talking (remove "end")
  //   if (status === "talking") {
  //     audio.current.pause();
  //     audio.current.currentTime = 0;

  //     // ✅ interval start
  //     interval = setInterval(() => {
  //       setTimer((prev) => prev + 1);
  //     }, 1000);
  //   }

  //   if (status === "end") {
  //     audio.current.pause();
  //     audio.current.currentTime = 0;

  //     const endAudio = new Audio("/sound/end.mp3");

  //     endAudio
  //       .play()
  //       .catch((err) => console.log("❌ Audio blocked on end call:", err));

  //     notify.destroy();
  //   }

  //   return () => {
  //     // ✅ FIX 2: clear interval
  //     if (interval) {
  //       clearInterval(interval);
  //     }

  //     if (audio.current) {
  //       audio.current.pause();
  //       audio.current.currentTime = 0;
  //     }
  //   };
  // }, [status]);

  useEffect(() => {
    if (!liveActiveSession) {
      endCallFromLocal();
    }
  }, [liveActiveSession]);

  //  detect comming offer
  useEffect(() => {
    if (sdp) {
      notify.destroy();
      onOffer(sdp);
    }
  }, [sdp]);

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
          {status === "talking" && <label>{formatCallTime(timer)}</label>}

          {(status === "pending" || status === "end") && (
            <Button onClick={StartCall} icon="phone-fill" type="success">
              Call
            </Button>
          )}

          {status === "talking" && (
            <Button
              onClick={endCallFromLocal}
              icon="close-circle-line"
              type="danger"
            >
              End
            </Button>
          )}
        </div>
      </div>
      <Modal open={open} centered footer onCancel={redirectOnCallEnd}>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Call Ended</h1>
          <button
            onClick={redirectOnCallEnd}
            className="text-white font-semibold bg-red-600 px-3 py-2 rounded-lg cursor-pointer"
          >
            Thank You
          </button>
        </div>
      </Modal>
      {notifyUi}
    </div>
  );
};
export default Videochat;
