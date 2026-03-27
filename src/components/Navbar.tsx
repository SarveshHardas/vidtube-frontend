import logoNoBg from "../assets/logos/logo-nobg.png";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth.api";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/homefeed.api";

const Navbar = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      console.log("Logout response:", res.data);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      setCurrentUser(null);

      navigate("/login");
    } catch (error: any) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || "Logout failed");
    }
  };

  const getUser = async () => {
    try {
      const res = await getCurrentUser();
      setCurrentUser(res.data.data);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getUser();
  }, [currentUser]);

  return (
    <header className="h-14 border-b border-gray-800 flex justify-between items-center px-4">
      <img
        src={logoNoBg}
        alt="Vidtube"
        className="h-24 cursor-pointer"
        onClick={() => navigate("/")}
      />

      <div className="flex items-center justify-center gap-6">
        {currentUser && (
          <>
            <h1 className="text-white font-medium">{currentUser.fullname}</h1>

            <img
              src={currentUser.avatar?.replace("http://", "https://")}
              alt="Avatar"
              className="rounded-full w-10 h-10 border-2 border-white"
            />

            <button
              type="button"
              onClick={handleLogout}
              className="cursor-pointer px-3 py-1 border border-gray-600 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
