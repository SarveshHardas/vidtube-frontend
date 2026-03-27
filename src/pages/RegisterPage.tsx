import React, { useState } from "react";
import { registerUser } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeClosed, Upload } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Submitting");
    e.preventDefault();
    if (!avatar) {
      alert("Avatar is required!");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", form.fullname);
    formData.append("username", form.username);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("avatar", avatar);

    if (coverImage) formData.append("coverImage", coverImage);

    try {
      const res = await registerUser(formData);
      console.log(res.data);

      if (res.status === 201) {
        alert("Registration Successful. Please go to login.");
        navigate("/login");
      }
    } catch (error) {
      alert("Something went wrong!");
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 bg-linear-to-br from-black via-black to-[#1a0f2e] w-full min-h-screen mx-auto text-white">
      <h1 className="font-bold text-4xl p-2">Welcome to Vidtube!</h1>
      <p className="text-gray-500 p-2 mb-7">
        Join our community and start streaming
      </p>
      <div className="border-2 border-gray-600/60 rounded-xl p-6 w-full max-w-lg text-center">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            onChange={(e) => setForm({ ...form, fullname: e.target.value })}
            className="w-full text-gray-400 border-2 focus-none outline-none border-neutral-700/60 rounded-md p-3"
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full text-gray-400 border-2 focus-none outline-none border-neutral-700/60 rounded-md p-3"
          />
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full text-gray-400 border-2 focus-none outline-none border-neutral-700/60 rounded-md p-3"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full text-gray-400 border-2 focus-none outline-none border-neutral-700/60 rounded-md p-3"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <Eye /> : <EyeClosed />}
            </button>
          </div>
          <div className="relative">
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              className="hidden"
            />
            <label
              htmlFor="avatar"
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-600/60 rounded-lg cursor-pointer hover:border-gray-400/60 transition-colors ease-linear duration-300"
            >
              <Upload className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Upload Avatar</span>
            </label>
          </div>
          <div className="relative">
            <input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              className="hidden"
            />
            <label
              htmlFor="coverImage"
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-600/60 rounded-lg cursor-pointer hover:border-gray-400/60 transition-colors ease-linear duration-300"
            >
              <Upload className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Upload Cover Image</span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full my-4 max-w-xs hover:max-w-lg hover:rounded-none hover:text-xl hover:font-medium hover:bg-blue-500 bg-[#1a0f2e] p-2 rounded-2xl cursor-pointer transition-all ease-linear duration-600"
          >
            Register
          </button>
        </form>
        <p>Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a></p>
      </div>
    </div>
  );
};

export default RegisterPage;
