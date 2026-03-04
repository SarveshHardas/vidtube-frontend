import React, { useState } from "react";
import { loginUser } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeClosed } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !username) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await loginUser({
        email,
        username,
        password,
      });

      console.log("Login response: ", res.data);
      const { accessToken } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      alert("Login Successful!");
      navigate("/");
    } catch (error: any) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col justify-evenly items-center mx-auto bg-linear-to-br from-black via-black to-[#1a0f2e] w-full min-h-screen p-4 text-white">
      <div className="border-2 border-neutral-500 rounded-xl p-6 w-full max-w-lg text-center">
        <h1 className="my-2 text-3xl font-semibold font-inter px-3 text-left">
          Welcome Back
        </h1>
        <p className="mb-10 text-gray-600 text-s font-light px-3 text-left">
          Log in to your account to continue
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name=""
            id=""
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-gray-400 border-2 focus-none outline-none border-neutral-700/60 rounded-md px-3 py-4"
          />
          <input
            type="text"
            name=""
            id=""
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full text-gray-400 border-2 focus-none outline-none border-neutral-700/60 rounded-md px-3 py-4"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-gray-400 border-2 focus-none outline-none border-neutral-700/60 rounded-md px-3 py-4"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <Eye /> : <EyeClosed />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full my-4 max-w-xs hover:max-w-lg hover:rounded-none hover:text-xl hover:font-medium hover:bg-blue-500 bg-[#1a0f2e] p-2 rounded-2xl cursor-pointer transition-all ease-linear duration-600"
          >
            Log In
          </button>
        </form>
        <div className="mt-10 text-gray-500/50 text-center">
          <hr />
          <p className="mt-3 text-gray-500">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
      <p className="text-gray-500 pt-7 text-xs">
        *By logging in, you agree to our Terms of Services and Privacy Policy
      </p>
    </div>
  );
};

export default LoginPage;
