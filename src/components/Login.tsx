import { Link } from "react-router-dom";
import "animate.css";
import Form from "./shared/Form";
import Input from "./shared/Input";
import Button from "./shared/Button";

const Login = () => {
  return (
    <div className="bg-slate-100 w-full h-screen flex items-center justify-center">
      <div className="w-7/12 flex justify-between bg-white shadow border border-gray-100 rounded-lg overflow-hidden">
        {/* Left Image */}
        <img
          src="/Images/image.jpg"
          alt="login"
          className="w-[50%]  h-full object-cover animate__animated animate__fadeInRight animate__faster"
        />

        {/* Right Content */}
        <div className="p-8 space-y-6 w-full animate__animated animate__fadeInLeft animate__faster">
          <div>
            <h1 className="font-bold text-xl text-black">SIGN IN</h1>
            <p className="text-xs text-gray-500">
              Your friends are waiting for you!
            </p>
          </div>

          {/* Form */}
          <Form
            className="flex flex-col gap-5 w-full"
            onValue={(v) => console.log(v)}
          >
            {/* Email */}
            <Input name="email" type="text" placeholder="Email Id" />

            {/* Password */}
            <Input
              name="password"
              type="password"
              placeholder="Email Password"
            />

            {/* Button */}
            {/* <button
              type="button"
              className="flex items-center gap-2 bg-rose-500 text-white font-medium w-fit px-5 py-2 rounded"
            >
              <i className="ri-"></i>
              Sign In
            </button> */}
            <Button icon="arrow-right-up-line" type="secondary">
              Sign In
            </Button>
          </Form>

          {/* Signup Link */}
          <p className="text-sm">
            Don’t have an account?{" "}
            <Link className="text-green-500 font-medium" to="/signup">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
