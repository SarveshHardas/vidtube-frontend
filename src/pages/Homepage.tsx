import { logoutUser } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      console.log("Logout response: ", res.data);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      alert("Logout  successfull.");
      navigate("/login");
    } catch (error:any) {
      console.log(error?.response?.data);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <h1 className="font-sans">Home Feed</h1>
      <div className="fixed right-5 top-5">
        <button type="button" onClick={handleLogout} className="cursor-pointer">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Homepage;
