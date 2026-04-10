import { Link } from "react-router-dom";
import Card from "../../shared/Card";
import { useContext, useEffect, useState } from "react";
import socket from "../../lib/socket";
import Context from "../../../Context";

const FriendsOnline = () => {
  const [onlineUser, setOnlineUser] = useState([]);
  const { session } = useContext(Context);

  const onlineHandler = (user: any) => {
    // console.log(user);
    return setOnlineUser(user);
  };

  useEffect(() => {
    socket.on("online", onlineHandler);

    socket.emit("get-online");

    return () => {
      socket.off("online", onlineHandler);
    };
  }, []);

  return (
    <div className="h-screen pb-6 overflow-auto scrollbar-hide">
      <Card title="Friends Online" border>
        <div className="space-y-3">
          {session &&
            onlineUser
              .filter((item: any) => item.id !== session.id)
              .map((item: any, index) => (
                <div
                  key={index}
                  className="bg-gray-100 flex items-center justify-between p-3"
                >
                  {/* LEFT: Profile */}
                  <div className="flex items-center gap-3">
                    {/* Image + Online dot */}
                    <div className="relative">
                      <img
                        src={item.image || "/Images/Profile.jpg"}
                        alt="profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />

                      {/* Online indicator */}
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate__animated animate__pulse animate__infinite"></span>
                    </div>

                    {/* Name + status */}
                    <div>
                      <h4 className="text-sm font-medium text-black">
                        {item.fullname}
                      </h4>
                      <p className="text-xs text-gray-500">Online</p>
                    </div>
                  </div>

                  {/* RIGHT: Actions */}
                  <div className="flex items-center gap-2">
                    <Link to={`/app/chat/${item.id}`}>
                      <button title="Chat" className="cursor-pointer">
                        <i className="ri-chat-ai-line text-blue-400 hover:text-blue-500 text-sm"></i>
                      </button>
                    </Link>

                    <Link to={"/app/voice-call"}>
                      <button title="Phone" className="cursor-pointer">
                        <i className="ri-phone-line text-green-400 hover:text-green-500 text-sm"></i>
                      </button>
                    </Link>

                    <Link to={"/app/video-chat"}>
                      <button title="Video Call" className="cursor-pointer">
                        <i className="ri-video-on-ai-line text-amber-400 hover:text-amber-500 text-sm"></i>
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
        </div>
      </Card>
    </div>
  );
};

export default FriendsOnline;
