import axios from "./axios";

export const loginUser = (data: {
  email: string;
  username: string;
  password: string;
}) => axios.post("/users/login", data);

export const registerUser = (formData: FormData) =>
  axios.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
