import { Link, useNavigate } from "react-router-dom";
import "animate.css";
import Form, { type FormDataType } from "./shared/Form";
import Input from "./shared/Input";
import Button from "./shared/Button";
import HttpInterceptor from "./lib/HttpInterceptor";
import { Catcherr } from "./lib/CatchError";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();

  const signup = async (values: FormDataType) => {
    try {
      const { data } = await HttpInterceptor.post("/auth/register", values);
      toast.success(data.message);

      navigate("/login");
    } catch (err: unknown) {
      Catcherr(err);
    }
  };

  return (
    <div className="bg-slate-100 w-full h-screen flex items-center justify-center">
      <div className="w-7/12 flex justify-between bg-white shadow border border-gray-100 rounded-lg overflow-hidden">
        {/* Left Content */}
        <div className="p-8 space-y-6 w-full animate__animated animate__fadeInRight animate__faster">
          <div>
            <h1 className="font-bold text-xl text-black">SIGN UP</h1>
            <p className="text-xs text-gray-500">Start your first chat now!</p>
          </div>

          {/* Form */}

          <Form className="flex flex-col gap-5 w-full" onValue={signup}>
            {/* Email */}
            <Input name="fullname" type="text" placeholder="Fullname" />
            <Input name="email" type="text" placeholder="Email Id" />
            <Input name="mobile" type="number" placeholder="Mobile" />

            {/* Password */}
            <Input
              name="password"
              type="password"
              placeholder="Email Password"
            />

            <Button icon="arrow-right-up-line" type="secondary">
              Sign In
            </Button>
          </Form>

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
          className="w-[50%] lg:block hidden h-full object-cover animate__animated animate__fadeInLeft animate__faster"
        />
      </div>
    </div>
  );
};

export default Signup;
