import Card from "../shared/Card";

const Friends = () => {
  return (
    <div className="grid grid-cols-3 gap-4 overflow-auto h-[530px] scrollbar-hide">
      {Array(20)
        .fill(0)
        .map((item, index) => (
          <div key={index} className="">
            <Card shadow>
              <div className="flex flex-col items-center justify-center py-3 gap-2 ">
                <img
                  src="/Images/Profile.jpg"
                  alt=""
                  className="h-25 w-25 rounded-full "
                />
                <h1 className="font-medium text-black">Saurav Kumar</h1>
                <button className="bg-red-500 font-medium mt-1 hover:bg-red-400 text-xs text-white px-3 py-1.5 rounded">
                  <i className="ri-user-add-line mr-1"></i>
                  Unfriend
                </button>
              </div>
            </Card>
          </div>
        ))}
    </div>
  );
};

export default Friends;
