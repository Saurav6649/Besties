import { Link } from "react-router-dom";
import "animate.css";

const Signup = () => {
  return (
    <div className="bg-slate-100 w-full h-screen flex items-center justify-center">
      <div className="w-7/12 flex justify-between bg-white shadow border border-gray-100 rounded-lg overflow-hidden">

        {/* Left Content */}
        <div className="p-8 space-y-6 w-full animate__animated animate__fadeInRight animate__faster">
          <div>
            <h1 className="font-bold text-xl text-black">SIGN UP</h1>
            <p className="text-xs text-gray-500">
              Start your first chat now!
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-5 w-full">

            {/* Fullname */}
            <input
              type="text"
              placeholder="Fullname"
              className="border w-full border-gray-200 px-4 py-2 rounded-lg outline-none"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email Id"
              className="border w-full border-gray-200 px-4 py-2 rounded-lg outline-none"
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              className="border w-full border-gray-200 px-4 py-2 rounded-lg outline-none"
            />

            {/* Mobile */}
            <input
              type="tel"
              placeholder="+91 8978675645"
              className="border w-full border-gray-200 px-4 py-2 rounded-lg outline-none"
            />

            {/* Button */}
            <button
              type="button"
              className="flex items-center gap-2 bg-rose-500 text-white font-medium w-fit px-5 py-2 rounded"
            >
              <i className="ri-arrow-right-up-line"></i>
              Sign Up
            </button>
          </form>

          {/* Login Link */}
          <p className="text-sm">
            Already have an account?{" "}
            <Link className="text-green-500 font-semibold" to="/login">
              Sign in
            </Link>
          </p>
        </div>

        {/* Right Image */}
        <img
          src="/Images/image.jpg"
          alt="signup"
          className="w-[50%] h-full object-cover animate__animated animate__fadeInLeft animate__faster"
        />
      </div>
    </div>
  );
};

export default Signup;