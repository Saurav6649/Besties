import Card from "../shared/Card";

import useSWR, { mutate } from "swr";
import Fetcher from "../lib/Fetcher";
import { Empty, message, Skeleton } from "antd";
import Error from "../shared/Error";

import { Catcherr } from "../lib/CatchError";
import HttpInterceptor from "../lib/HttpInterceptor";
import { useState } from "react";
import SmallButton from "../shared/SmallButton";
import moment from "moment";

interface LoadingInterface {
  state: boolean;
  index: number;
}

const Suggestedfriends = () => {
  const [loading, setLoading] = useState<LoadingInterface>({
    state: false,
    index: 0,
  });
  const { data, error, isLoading } = useSWR("/friend/suggested", Fetcher);

  const FetchFriends = async (id: string, index: number) => {
    try {
      setLoading({
        state: true,
        index,
      });
      await HttpInterceptor.post("/friend", { friend: id });
      message.success("friend requested sent !");
      mutate("/friend/suggested");
      mutate("/friend");
    } catch (err) {
      Catcherr(err);
    } finally {
      setLoading({ state: false, index: 0 });
    }
  };

  return (
    <div className="w-full border border-gray-100 rounded-lg h-[200px] overflow-auto scrollbar-hide">
      <Card title="Add Friends">
        {isLoading && <Skeleton active />}

        {error && <Error message={error.message} />}

        {data && (
          <div className="space-y-5">
            {data.map((item: any, index: number) => (
              <div
                key={index}
                className="flex  bg-gray-100 rounded  px-3 py-2 items-start"
              >
                {/* <Avatar
                  img={item.image || "/Images/Profile.jpg"}
                  titleColor="black"
                  title={item.fullname}
                  subtitle={
                    <div>
                      <p className="text-gray-800  py-1">date</p>
                      <Button
                        onClick={() => FetchFriends(item._id, index)}
                        size="md"
                        type="success"
                        icon="user-add-line"
                        loading={loading.state && loading.index === index}
                      >
                        Add Friend
                      </Button>
                    </div>
                  }
                /> */}
                <div className="flex justify-center items-start gap-3">
                  {/* LEFT IMAGE */}
                  <img
                    src={item.image || "/Images/Profile.jpg"}
                    alt="profile"
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  {/* RIGHT CONTENT */}
                  <div className="flex flex-col gap-1">
                    {/* Name */}
                    <h1 className="text-sm font-medium text-gray-800 capitalize">
                      {item.fullname}
                    </h1>

                    {/* Date */}
                    <p className="text-[11px] text-gray-500 font-medium">
                      {moment(item.createdAt).format("DD MM YYYY")}
                    </p>

                    {/* Button */}
                    <SmallButton
                      loading={loading.state && loading.index === index}
                      onClick={() => FetchFriends(item._id, index)}
                      icon="ser-add-line"
                      type="secondary"
                    >
                      Add Friend
                    </SmallButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {data && data.length === 0 && <Empty />}
      </Card>
    </div>
  );
};

export default Suggestedfriends;
/*
 */
