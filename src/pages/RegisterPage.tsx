import React, { useState } from "react";
import { registerUser } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

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
        navigate("/login")
      }

    } catch (error) {
      alert("Something went wrong!");
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center p-4 bg-neutral-800 w-full min-h-screen mx-auto text-white">
      <div className="border-2 border-neutral-500 rounded-xl p-6 w-full max-w-lg text-center">
        <h1 className="font-bold text-2xl p-2">Welcome to Vidtube!</h1>
        <h1 className="font-bold text-2xl p-2 mb-7">Registration form</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            onChange={(e) => setForm({ ...form, fullname: e.target.value })}
            className="w-full text-gray-300 border-2 focus-none outline-none border-neutral-300 rounded-md p-3"
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full text-gray-300 border-2 focus-none outline-none border-neutral-300 rounded-md p-3"
          />
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full text-gray-300 border-2 focus-none outline-none border-neutral-300 rounded-md p-3"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full text-gray-300 border-2 focus-none outline-none border-neutral-300 rounded-md p-3"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files?.[0] || null)}
            className="w-full p-6 border-2 border-neutral-300 rounded-md"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            className="w-full p-6 border-2 border-neutral-300 rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-blue-400 p-3 rounded-md hover:bg-green-500 transition-all ease-linear duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
