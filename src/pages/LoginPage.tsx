import React, { useState } from "react";
import { loginUser } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
    <div className="flex justify-center items-center mx-auto bg-neutral-800 w-full min-h-screen p-4 text-white">
      <div className="border-2 border-neutral-500 rounded-xl p-6 w-full max-w-lg text-center hover:scale-110 transition-all ease-linear duration-300">
        <h1 className="mb-6 text-3xl font-semibold font-sans">Login Page</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name=""
            id=""
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-transparent outline-none text-gray-300 border-2 border-gray-400 rounded-2xl"
          />
          <input
            type="text"
            name=""
            id=""
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 bg-transparent outline-none text-gray-300 border-2 border-gray-400 rounded-2xl"
          />
          <input
            type="password"
            name=""
            id=""
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-transparent outline-none text-gray-300 border-2 border-gray-400 rounded-2xl"
          />
          <button
            type="submit"
            className="w-full max-w-xs hover:max-w-md  bg-blue-500 hover:bg-green-500 p-2 rounded-2xl transition-all ease-linear duration-300 "
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
