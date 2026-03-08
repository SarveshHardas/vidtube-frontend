import axios from "./axios";

export const getCurrentUser = () => axios.get("/users/current-user");
