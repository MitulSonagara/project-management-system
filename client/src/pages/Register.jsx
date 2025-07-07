import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { registerUser } from "../redux/Slices/authSlice";
import { toast } from 'react-toastify'
import { Link } from "react-router-dom";
import { Button, Input } from "@material-tailwind/react";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";



const Register = () => {
  const { register, handleSubmit } = useForm();

  const dispatch = useDispatch();

  const [passwordVisible, setPasswordVisible] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };


  const onSubmit = async (userData) => {
    dispatch(registerUser(userData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
      } else {
        toast.error(data?.payload?.message);
      }
    })
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-[80vh] flex items-center"
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          Create Account
        </p>

        <div className="w-full py-1">
          <Input
            label="Full Name"
            name="name"
            {...register("name")}
            type="text"
            required
          />
        </div>

        <div className="w-full py-1">
          <Input
            name="email"
            label="Email"
            {...register("email")}
            type="email"
            required
          />
        </div>
        <div className="w-full py-1">
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
          Create account
        </Button>

        <p>
          Already have an account?{" "}
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login here
          </Link>
        </p>
      </div>
    </form>
  );
};

export default Register;