import axios from "./axios";

export const getCurrentUser = () => axios.get("/users/current-user");
export const getAllVideos = () => axios.get("/videos")