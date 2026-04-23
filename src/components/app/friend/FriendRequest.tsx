import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Scrollbar } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import Card from "../../shared/Card";
import SmallButton from "../../shared/SmallButton";
import useSWR, { mutate } from "swr";
import Fetcher from "../../lib/Fetcher";
import { Empty, message, Skeleton } from "antd";
import { Catcherr } from "../../lib/CatchError";
import HttpInterceptor from "../../lib/HttpInterceptor";

const FriendRequest = () => {
  const { data, isLoading, error } = useSWR("/friend/request", Fetcher);

  if (isLoading) return <Skeleton active />;

  if (error) return <Empty />;

  // console.log(data);

  const acceptRequest = async (id: string) => {
    try {
      const { data } = await HttpInterceptor.put(`/friend/${id}`, {
        status: "accepted",
      });
      message.success(data.message);
      mutate("/friend/request");
      mutate("/friend/");
    } catch (err) {
      Catcherr(err);
    }
  };

  return (
    <Card title="Requests" divider shadow>
      <div className="p-4">
        <Swiper
          modules={[FreeMode]}
          freeMode={true}
          slidesPerView={"auto"}
          spaceBetween={16}
          className="!py-4"
        >
          {data.length === 0 && <Empty />}
          {data &&
            data.map((item: any, index: number) => (
              <SwiperSlide key={index} className="!w-[160px]">
                <div className="flex flex-col items-center gap-3 border border-gray-200 shadow-sm hover:shadow-md transition rounded-2xl p-4 bg-white">
                  <img
                    src={item.user.image || "/Images/Profile.jpg"}
                    className="w-[70px] h-[70px] rounded-full object-cover"
                  />

                  <h1 className="text-black font-medium text-sm text-center">
                    {item.user.fullname}
                  </h1>

                  <SmallButton
                    onClick={() => acceptRequest(item._id)}
                    icon="check-double-line"
                    type="danger"
                  >
                    Accept
                  </SmallButton>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </Card>
  );
};
export default FriendRequest;
