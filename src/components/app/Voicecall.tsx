import Button from "../shared/Button";
import Card from "../shared/Card";

const Voicecall = () => {
  return (
    <div className="p-2 space-y-6">
      {/* mutiple user video */}
      <div className="grid grid-cols-2 gap-4 ">
        <Card title="Saurav Babu" shadow>
          <div className=" flex  justify-center">
            <img
              src="/Images/Profile.jpg"
              alt="avt"
              className="h-40 w-40 rounded-full"
            />
          </div>
        </Card>
        <Card title="Saurav Babu" shadow>
          <div className=" flex  justify-center">
            <img
              src="/Images/Profile.jpg"
              alt="avt"
              className="h-40 w-40 rounded-full"
            />
          </div>
        </Card>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-5">
          <button className="w-12 h-12 rounded-full bg-amber-500 text-white hover:bg-amber-400">
            <i className="ri-mic-line"></i>
          </button>
        </div>
        <Button icon="close-circle-line" type="danger">
          End
        </Button>
      </div>
    </div>
  );
};

export default Voicecall;
