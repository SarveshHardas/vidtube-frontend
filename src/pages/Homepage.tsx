import { logoutUser } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api/homefeed.api";
import { useState, useEffect } from "react";

const Homepage = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<any>(null);

  const getUser = async () => {
    try {
      const res = await getCurrentUser();
      console.log(res);
      setCurrentUser(res.data.data);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []);



  return (
    <div>Homefeed</div>
  );
};

export default Homepage;
