import logoNoBg from "../assets/logos/logo-nobg.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { Camera, List, Plus, Video } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [showCreateList, setShowCreateList] = useState(false)

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleUploadVideo = () => {
    navigate("/videos")
    setShowCreateList(false)
  }

  const handleCreatePlaylist = () => {
    navigate("/playlist")
    setShowCreateList(false)
  }

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
            {showCreateList && (
              <>
                <div className="absolute top-14 right-55 bg-gray-900 border border-gray-800 rounded p-2 z-50">
                  <ul className="space-y-2">
                    <li className=" cursor-pointer hover:bg-gray-800 p-2 rounded">
                      <button className="flex gap-2" onClick={handleUploadVideo}><Video /> Upload Video</button>
                    </li>
                    <li className=" cursor-pointer hover:bg-gray-800 p-2 rounded">
                      <button className="flex gap-2" onClick={handleCreatePlaylist}><List /> Create Playlist</button>
                    </li>
                  </ul>
                </div>
              </>
            )}
            <button className="flex gap-2 cursor-pointer" onClick={() => setShowCreateList(!showCreateList)}>
              <Plus/>Create
            </button>

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
