import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import Card from "../../shared/Card";
import SmallButton from "../../shared/SmallButton";

const FriendSuggestion = () => {
  return (
    <Card title="Suggestions" divider shadow>
      <div className="p-4">
        <Swiper
          slidesPerView={4}
          spaceBetween={30}
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
              <SwiperSlide key={index}>
                <div className="flex flex-col items-center gap-2 border border-gray-200 rounded-2xl p-4">
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
        </Swiper>
      </div>
    </Card>
  );
};
export default FriendSuggestion;
