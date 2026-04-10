import axios from "./axios";

export const uploadVideo = (videoData: FormData) => axios.post("/videos", videoData);