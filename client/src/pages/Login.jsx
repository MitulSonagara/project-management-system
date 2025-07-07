import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/Slices/authSlice";
import { Link } from "react-router-dom";
import { Button, Input } from "@material-tailwind/react";
import { useState } from "react"; // Import useState hook
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "react-toastify";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();

  // State to toggle password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onSubmit = (userData) => {
    dispatch(loginUser(userData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
      } else {
        toast.error(data?.payload?.message);
      }
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-[80vh] flex items-center"
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          Login
        </p>
        <div className="w-full my-1">
          <Input
            name="email"
            label="Email"
            {...register("email")}
            type="email"
            required
          />
        </div>
        <div className="w-full my-1">
          <Input label="Password" name="passwprd" {...register("password")} type={passwordVisible ? "text" : "password"}
            icon={passwordVisible ?
              <EyeClosed onClick={togglePasswordVisibility} className="w-5 h-5 text-gray-500" />
              :
              <Eye onClick={togglePasswordVisibility} className="w-5 h-5 text-gray-500" />
            } required />
        </div>
        <Button
          type="submit"
          fullWidth
        >
          Login
        </Button>
        <p>
          Create a new account?{" "}
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register here
          </Link>
        </p>
      </div>
    </form>
  );
};

export default Login;
