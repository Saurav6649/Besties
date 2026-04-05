import React, { type FC } from "react";
import SmallButton from "../../shared/SmallButton";
import { Link } from "react-router-dom";
import IconButton from "../../shared/Iconbutton";

interface FriendListInterface {
  gap?: number;
  columns?: number;
}

const FriendList: FC<FriendListInterface> = ({ gap, columns = 3 }) => {
  return (
    <div className={`grid grid-cols-${columns} gap-${gap} overflow-auto`}>
      {Array(12)
        .fill(0)
        .map((item, index) => (
          <div
            key={index}
            className="flex flex-col w-full relative min-w-0  items-center gap-3 border border-gray-200 rounded-2xl px-3 py-3"
          >
            <img
              src="/Images/Profile.jpg"
              alt=""
              className="w-[80px] h-[80px] rounded-full object-cover"
            />
            <h1 className="text-black font-medium text-base">User Name</h1>
            <SmallButton icon="user-minus-line" type="danger">
              Unfollow
            </SmallButton>
            <div className="w-2 h-2 absolute top-3 right-3 bg-green-500 rounded-full animate__animated animate__pulse animate__infinite"></div>
            <div className="flex gap-4 items-center justify-center">
              <Link to={"/app/chat"}>
                <IconButton size="md" icon="chat-ai-line" type="primary" />
              </Link>
              <Link to={"/app/voice-call"}>
                <IconButton size="md" icon="phone-line" type="success" />
              </Link>
              <Link to={"/app/video-chat"}>
                <IconButton size="md" icon="video-on-ai-line" type="warning" />
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default FriendList;
