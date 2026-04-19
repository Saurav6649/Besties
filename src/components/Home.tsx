import { useRazorpay } from "react-razorpay";
import type { RazorpayOrderOptions } from "react-razorpay";
import Button from "./shared/Button";
import { Catcherr } from "./lib/CatchError";
import HttpInterceptor from "./lib/HttpInterceptor";
const env = import.meta.env;

const Home = () => {
  const { Razorpay } = useRazorpay();

  const pay = async () => {
    try {
      const { data } = await HttpInterceptor.post("/payment/order", {
        amount: 500,
      });
      console.log("data", data);

      const options: RazorpayOrderOptions = {
        key: env.VITE_RAZOR_KEY_ID,
        name: "Besties Network",
        description: "React Course",
        image:
          "https://img.freepik.com/free-vector/besties-word-logo-white-background_1308-87189.jpg",
        amount: data.amount,
        currency: env.VITE_CURRENCY,
        order_id: data.id,
        handler: (data) => {
          console.log(data);
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", (data) => {
        console.log("payment failed");
      });
    } catch (err) {
      Catcherr(err);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={pay}>
        Pay Now
      </Button>
    </div>
  );
};

export default Home;
