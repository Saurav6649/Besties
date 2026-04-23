import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Scrollbar } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
// import "swiper/css/free-mode";
import Card from "../../shared/Card";
import SmallButton from "../../shared/SmallButton";
import useSWR, { mutate } from "swr";
import Fetcher from "../../lib/Fetcher";
import { Empty, message, Skeleton } from "antd";
import HttpInterceptor from "../../lib/HttpInterceptor";

const FriendSuggestion = () => {
  const { data, isLoading, error } = useSWR("/friend/suggested", Fetcher);

  if (isLoading) return <Skeleton active />;

  if (error) return <Empty />;

  const sendFriendRequest = async (id: string) => {
    const { data } = await HttpInterceptor.post("/friend", { friend: id });
    mutate("/friend/suggested");
    mutate("/friend/");
    message.success(data.message);
  };

  return (
    <Card title="Suggestions" divider shadow>
      {data.length === 0 && <Empty />}
      <div className="p-4 ">
        {/* <Swiper
          slidesPerView={2}
          direction="horizontal"
          spaceBetween={10}
          className="mySwiper"
          breakpoints={{
            0: {
              slidesPerView: 2,
            },
            640: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
        >
          {Array(10)
            .fill(0)
            .map((item, index) => (
              <SwiperSlide key={index} className="!flex justify-center">
                <div className="w-full flex flex-col items-center gap-2 border rounded-2xl p-4 bg-white">
                  <img
                    src="/Images/Profile.jpg"
                    alt=""
                    className="w-[80px] h-[80px] rounded-full object-cover"
                  />
                  <h1 className="text-black font-medium text-base">
                    User Name
                  </h1>
                  <SmallButton icon="user-add-line" type="success">
                    Add
                  </SmallButton>
                </div>
              </SwiperSlide>
            ))}
        </Swiper> */}
        <Swiper
          modules={[FreeMode, Scrollbar]}
          scrollbar={{ draggable: true }}
          freeMode={true}
          slidesPerView={"auto"}
          spaceBetween={12}
          className="!py-4 !h-[220px]"
        >
          {data &&
            data.map((item: any, index: number) => (
              <SwiperSlide key={index} className="!w-[140px]">
                <div className="w-full flex flex-col items-center gap-2 border border-gray-100 shadow-md rounded-2xl p-4 bg-white">
                  <img
                    src={item.image || "/Images/Profile.jpg"}
                    alt=""
                    className="w-[80px] h-[80px] rounded-full object-cover"
                  />
                  <h1 className="text-black font-medium text-base">
                    {item.fullname}
                  </h1>
                  <SmallButton
                    onClick={() => sendFriendRequest(item._id)}
                    icon="user-add-line"
                    type="success"
                  >
                    Add
                  </SmallButton>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </Card>
  );
};
export default FriendSuggestion;
