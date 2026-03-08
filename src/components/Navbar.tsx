import { useState, useEffect } from "react";
import logoNoBg from "../assets/logos/logo-nobg.png";
import { getCurrentUser } from "../api/homefeed.api";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth.api";

const Navbar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);

  const getUser = async () => {
    try {
      const res = await getCurrentUser();
      setCurrentUser(res.data.data);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      console.log("Logout response: ", res.data);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      alert("Logout  successfull.");
      navigate("/login");
    } catch (error: any) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <header className="h-14 border-b border-gray-800 flex justify-between items-center px-4">
      <img src={logoNoBg} alt="Vidtube" className="h-24" />
      <div className="flex items-center justify-center gap-7 mx-3">
        {currentUser && (
          <>
            <h1>{currentUser.username}</h1>
            <img
              src={currentUser.avatar.replace("http://", "https://")}
              alt="Avatar"
              className="rounded-full w-10 h-10 border-2 border-white border-double"
            />
          </>
        )}
        <button type="button" onClick={handleLogout} className="cursor-pointer">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
