import React, { type FC } from "react";
import SmallButton from "../../shared/SmallButton";
import Fetcher from "../../lib/Fetcher";
import useSWR, { mutate } from "swr";
import { Empty, message, Skeleton } from "antd";
import { Catcherr } from "../../lib/CatchError";
import HttpInterceptor from "../../lib/HttpInterceptor";

interface FriendListInterface {
  gap?: number;
  columns?: number;
}

const FriendList: FC<FriendListInterface> = () => {
  const { data, isLoading, error } = useSWR("/friend/", Fetcher);

  if (isLoading) return <Skeleton active />;

  if (error) return <Empty />;

  if (data.length === 0) return <Empty />;

  const deleteFriend = async (id: string) => {
    try {
      const { data } = await HttpInterceptor.delete(`/friend/${id}`);
      mutate("/friend/suggested");
      mutate("/friend/");
      message.success(data.message);
    } catch (err) {
      Catcherr(err);
    }
  };

  console.log(data);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {data &&
        data.map((item: any, index: number) => (
          <div
            key={index}
            className="relative flex flex-col items-center gap-4 border border-gray-200 rounded-2xl px-4 py-5 bg-white shadow-sm hover:shadow-md transition"
          >
            <img
              src={item.friend.image || "/Images/Profile.jpg"}
              alt=""
              className="w-[80px] h-[80px] rounded-full object-cover"
            />
            <h1 className="text-black font-medium text-base">
              {item.friend.fullname}
            </h1>
            {item.status === "requested" ? (
              <SmallButton icon="check-double-line" type="primary">
                Friend request sent
              </SmallButton>
            ) : (
              <SmallButton
                onClick={() => deleteFriend(item._id)}
                icon="user-minus-line"
                type="danger"
              >
                Unfriend
              </SmallButton>
            )}
            {/* <div className="w-2 h-2 absolute top-3 right-3 bg-green-500 rounded-full animate__animated animate__pulse animate__infinite"></div> */}
            {/* <div className="flex gap-4 items-center justify-center">
              <Link to={"/app/chat"}>
                <IconButton size="md" icon="chat-ai-line" type="primary" />
              </Link>
              <Link to={"/app/voice-call"}>
                <IconButton size="md" icon="phone-line" type="success" />
              </Link>
              <Link to={"/app/video-chat"}>
                <IconButton size="md" icon="video-on-ai-line" type="warning" />
              </Link>
            </div> */}
          </div>
        ))}
    </div>
  );
};

export default FriendList;
