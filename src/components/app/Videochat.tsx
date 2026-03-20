import Button from "../shared/Button";

const Videochat = () => {
  return (
    <div className="p-2 space-y-6">
      <div className="w-full h-0 relative pb-[56.25%] bg-black  rounded-xl">
        <video src="" className="w-full h-full absolute top-0 left-0"></video>
        <button className="bg-white/10 px-3 py-2 text-xs rounded-lg text-white absolute bottom-5 left-5">
          Saurav Kumar
        </button>
        <button className="bg-white/10 px-3 py-2 text-xs rounded-lg text-white absolute bottom-5 right-5 transition-all duration-150 hover:scale-110">
          <i className="ri-fullscreen-exit-line"></i>
        </button>
      </div>

      {/* mutiple user video */}
      <div className="grid grid-cols-3 gap-4 ">
        <div className="w-full h-0 relative pb-[56.25%] bg-black  rounded-xl">
          <video src="" className="w-full h-full absolute top-0 left-0"></video>
          <button className="bg-white/10 px-3 py-2 text-xs rounded-lg text-white absolute bottom-5 left-5">
            Saurav Kumar
          </button>
        </div>
        <Button icon="user-add-line">Add</Button>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-5">
          <button className="w-12 h-12 rounded-full bg-amber-500 text-white hover:bg-amber-400">
            <i className="ri-mic-line"></i>
          </button>
          <button className="w-12 h-12 rounded-full bg-violet-500 text-white hover:bg-violet-400">
            <i className="ri-video-on-line"></i>
          </button>
          <button className="w-12 h-12 rounded-full bg-blue-500 text-white hover:bg-blue-400">
            <i className="ri-tv-2-line"></i>
          </button>
        </div>
        <Button icon="close-circle-line" type="danger">
          End
        </Button>
      </div>
    </div>
  );
};
export default Videochat;
