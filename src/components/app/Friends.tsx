import { Empty, message, Skeleton } from "antd";
import Fetcher from "../lib/Fetcher";
import Card from "../shared/Card";
import Error from "../shared/Error";
import useSWR, { mutate } from "swr";
import SmallButton from "../shared/SmallButton";
import { Catcherr } from "../lib/CatchError";
import HttpInterceptor from "../lib/HttpInterceptor";

const Friends = () => {
  const { data, error, isLoading } = useSWR("/friend", Fetcher);

  console.log("Friend Section", data);

  if (isLoading) return <Skeleton active />;

  if (error) return <Error message={error.message} />;

  const handleUnfriend = async (id: string) => {
    try {
      const { data } = await HttpInterceptor.delete(`/friend/${id}`);
      message.success(data.message);
      mutate("/friend");
      mutate("/friend/suggested");
      mutate('/friend/request')
    } catch (err) {
      Catcherr(err);
    }
  };

  return (
    <>
    {data && data.length === 0 && <Empty />}
      {data && (
        <div className="grid grid-cols-3 gap-4 overflow-auto h-[530px] scrollbar-hide">
          {data.map((item: any, index: number) => (
            <div key={index} className="">
              <Card shadow>
                <div className="flex flex-col items-center justify-center py-3 gap-2 ">
                  <img
                    src={item.friend?.image || "/Images/Profile.jpg"}
                    alt=""
                    className="h-25 w-25 rounded-full "
                  />
                  <h1 className="font-medium text-black">
                    {item.friend?.fullname}
                  </h1>
                  {item.status === "accepted" ? (
                    <button
                      onClick={() => handleUnfriend(item._id)}
                      className="bg-red-500 font-medium mt-1 hover:bg-red-400 text-xs text-white px-3 py-1.5 rounded"
                    >
                      <i className="ri-user-add-line mr-1"></i>
                      Unfriend
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-cyan-500 font-medium mt-1 hover:bg-gray-500 text-xs text-white px-3 py-1.5 rounded"
                    >
                      <i className="ri-check-double-line mr-1"></i>
                      Request Sent
                    </button>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      
    </>
  );
};

export default Friends;
