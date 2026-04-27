import { useNavigate, useParams } from "react-router-dom";
import Button from "../shared/Button";
import Card from "../shared/Card";
import { useContext, useEffect, useRef, useState } from "react";
import Context from "../../Context";
import { Catcherr } from "../lib/CatchError";
import HttpInterceptor from "../lib/HttpInterceptor";
import { Modal, notification } from "antd";
import socket from "../lib/socket";
import type {
  callType,
  IceCandidateInterface,
  OnAnswerInterface,
  OnOfferInterface,
} from "./Videochat";

const Voicecall = () => {
  const { id } = useParams();

  const { session, liveActiveSession, sdp, setSdp } = useContext(Context);
  const navigate = useNavigate();
  const [isMic, setIsMic] = useState(false);
  const localAudio = useRef<HTMLAudioElement | null>(null);
  const remoteAudio = useRef<HTMLAudioElement | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const rtc = useRef<RTCPeerConnection | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const [notify, notifyUi] = notification.useNotification();
  const [status, setStatus] = useState<callType>("pending");
  const [open, setOpen] = useState(false);

  const toggleMic = async () => {
    try {
      if (!localAudio.current || !isMic) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        if (localAudio.current) {
          localAudio.current.srcObject = stream;
          localAudio.current.play();
        }

        localStream.current = stream;
        setIsMic(true);
      } else {
        localStream.current?.getTracks().forEach((track) => track.stop());

        if (localAudio.current) {
          localAudio.current.pause();
          localAudio.current.srcObject = null;
        }

        localStream.current = null;
        setIsMic(false);
      }
    } catch (err) {
      Catcherr(err);
    }
  };

  const connection = async () => {
    try {
      const { data } = await HttpInterceptor.get("/twilio/turn-server");
      rtc.current = new RTCPeerConnection({ iceServers: data });

      const localStreaming = localStream.current;
      if (!localStreaming) return;

      localStreaming.getTracks().forEach((track) => {
        rtc.current?.addTrack(track, localStreaming);
      });

      rtc.current.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("candidate", { candidate: e.candidate, to: id });
        }
      };

      rtc.current.onconnectionstatechange = () => {
        console.log(rtc.current?.connectionState);
      };

      rtc.current.ontrack = (e) => {
        if (e && remoteAudio.current) {
          const remoteStream = e.streams[0];
          remoteAudio.current.srcObject = remoteStream;
        }
      };
    } catch (err) {
      Catcherr(err);
    }
  };

  const stopAudio = () => {
    if (!audio.current) return;

    audio.current.pause();
    audio.current.currentTime = 0;
    audio.current.src = "";
  };

  const playAudio = (src: string, loop: boolean = false) => {
    stopAudio();

    if (!audio.current) audio.current = new Audio();

    const player = audio.current;
    player.src = src;
    player.loop = loop;
    player.load();
    player.play();
  };

  const endStreaming = () => {
    localStream.current?.getTracks().forEach((track) => {
      track.stop();
    });

    if (localAudio.current) localAudio.current.srcObject = null;
  };

  const endCallOnLocal = () => {
    setStatus("end");
    playAudio("/sound/end.mp3");
    notify.destroy();
    socket.emit("end", { to: id });
    endStreaming();
    setOpen(true);
  };

  const startCall = async () => {
    try {
      await connection();

      if (!rtc.current) return;

      const offer = await rtc.current.createOffer();
      await rtc.current.setLocalDescription(offer);

      notify.open({
        message: (
          <h1 className="capitalize font-medium">
            {liveActiveSession.fullname}
          </h1>
        ),
        description: "Calling....",
        duration: 30,
        onClose: stopAudio,
        placement: "bottomRight",
        actions: [
          <div key="calls">
            <Button
              onClick={endCallOnLocal}
              key="calls"
              icon="phone-fill"
              type="danger"
            >
              End Call
            </Button>
          </div>,
        ],
      });

      playAudio("/sound/Calling.mp3", true);

      setStatus("calling");
      socket.emit("offer", { offer, to: id, from: session, type: "audio" });
    } catch (err) {
      Catcherr(err);
    }
  };

  const acceptCall = async (payload: OnOfferInterface) => {
    try {
      setSdp(null); // ek bar data mill gya to accept ke badd khali kar do
      await connection();

      if (!rtc.current) return;

      const offer = new RTCSessionDescription(payload.offer);
      await rtc.current.setRemoteDescription(offer);

      const answer = await rtc.current.createAnswer();
      await rtc.current.setLocalDescription(answer);

      notify.destroy();
      setStatus("talking");
      stopAudio();
      socket.emit("answer", { answer, to: id });
    } catch (err) {
      Catcherr(err);
    }
  };

  const onAnswer = async (payload: OnAnswerInterface) => {
    try {
      if (!rtc.current) return;

      const answer = new RTCSessionDescription(payload.answer);
      await rtc.current.setRemoteDescription(answer);

      stopAudio();
      setStatus("talking");
      notify.destroy();
    } catch (err) {
      Catcherr(err);
    }
  };

  const onEndCall = () => {
  setStatus("end");
  playAudio("/sound/end.mp3"); // loop false
  notify.destroy();
  endStreaming();
  setOpen(true);
};

  const onOffer = (payload: OnOfferInterface) => {
    try {
      notify.open({
        message: (
          <h1 className="capitalize font-medium">{payload.from.fullname}</h1>
        ),
        description: "Incoming....",
        duration: 30,
        onClose: stopAudio,
        placement: "bottomRight",
        actions: [
          <div key="calls">
            <Button
              onClick={() => acceptCall(payload)}
              key="calls"
              icon="phone-fill"
              type="success"
            >
              Accept Call
            </Button>
            <Button
              key="calls"
              icon="phone-fill"
              type="danger"
              onClick={onEndCall}
            >
              End Call
            </Button>
          </div>,
        ],
      });

      playAudio("/sound/Calling.mp3", true);

      setStatus("incoming");
    } catch (err) {
      Catcherr(err);
    }
  };

  const onCandidate = async (payload: IceCandidateInterface) => {
    try {
      if (!rtc.current) return;

      const candidate = await new RTCIceCandidate(payload.candidate);
      await rtc.current.addIceCandidate(candidate);
    } catch (err) {
      Catcherr(err);
    }
  };

  useEffect(() => {
    toggleMic();
  }, []);

  const redirectOnCallEnd = () => {
    setOpen(false);
    navigate("/app");
  };

  useEffect(() => {
    socket.on("offer", onOffer);
    socket.on("answer", onAnswer);
    socket.on("candidate", onCandidate);
    socket.on("end", onEndCall);

    return () => {
      socket.off("offer", onOffer);
      socket.off("answer", onAnswer);
      socket.off("candidate", onCandidate);
      socket.off("end", onEndCall);
    };
  }, []);

  useEffect(() => {
    if (sdp) {
      notify.destroy();
      onOffer(sdp);
    }
  }, [sdp]);

  if (!liveActiveSession) return navigate("/app");

  return (
    <div className="p-2 space-y-6">
      {/* mutiple user video */}
      <div className="grid grid-cols-2 gap-4 ">
        <Card title={session.fullname} shadow>
          <audio hidden ref={localAudio} muted />
          <audio hidden ref={remoteAudio} autoPlay playsInline />
          <div className=" flex  justify-center">
            <img
              src={session.image || "/Images/Profile.jpg"}
              alt="avt"
              className="h-40 w-40 rounded-full"
            />
          </div>
        </Card>
        <Card title={liveActiveSession.fullname} shadow>
          <div className=" flex  justify-center">
            <img
              src={liveActiveSession.image || "/Images/Profile.jpg"}
              alt="avt"
              className="h-40 w-40 rounded-full"
            />
          </div>
        </Card>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-5">
          <button
            onClick={toggleMic}
            className="w-12 h-12 rounded-full bg-amber-500 text-white hover:bg-amber-400"
          >
            <i className={isMic ? "ri-mic-line" : "ri-mic-off-line"}></i>
          </button>
        </div>
        {(status === "pending" || status === "end") && (
          <Button onClick={startCall} icon="phone-line" type="success">
            Start Call
          </Button>
        )}
        {(status === "calling" || status === "talking") && (
          <Button icon="phone-line" type="danger" onClick={endCallOnLocal}>
            End Call
          </Button>
        )}
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

export default Voicecall;
