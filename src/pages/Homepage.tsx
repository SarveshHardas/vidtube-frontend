import { useState, useEffect } from "react";
import { getAllVideos } from "../api/homefeed.api";

const Homepage = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const getFeedVideos = async () => {
      try {
        const res = await getAllVideos();
        setVideos(res.data.data);
      } catch (err: any) {
        console.log(err.message);
      }
    };

    getFeedVideos();
  }, []);

  console.log(videos);

  return (
    <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
      {videos.map((video) => (
        <div
          key={video._id}
          className="flex justify-center items-center flex-col"
        >
          <img
            src={video.thumbnail.replace("http://", "https://")}
            alt={video.title}
            className="h-64 w-64"
          />
          <div className="flex justify-between items-center w-full px-7">
            <p className="text-white">{video.title}</p>
            <p className="text-white">{video.owner.username}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Homepage;
