import logoNoBg from "../assets/logos/logo-nobg.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

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
