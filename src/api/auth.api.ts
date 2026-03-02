import axios from "axios";

export const loginUser = (data: {
  email: string;
  username: string;
  password: string;
}) => axios.post("/user/login", data);

export const registerUser = (formData: FormData) =>
  axios.post("/user/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
