import { useState, useEffect } from "react";
import { getAllVideos } from "../api/homefeed.api";
import VideoCard from "../components/VideoCard";

interface VideoOwner {
  username: string;
  fullname: string;
  avatar?: string;
}

interface Video {
  _id: string;
  title: string;
  description?: string;
  thumbnail: string;
  owner: VideoOwner;
  views?: number;
  duration?: number;
  createdAt?: string;
}

const Homepage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFeedVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getAllVideos();
        const body = res.data;
        const inner = body?.data;
        const videoList =
          Array.isArray(body) ? body :
            Array.isArray(inner) ? inner :
              Array.isArray(inner?.docs) ? inner.docs :
                Array.isArray(inner?.videos) ? inner.videos :
                  Array.isArray(body?.videos) ? body.videos :
                    Array.isArray(body?.docs) ? body.docs :
                      [];

        setVideos(videoList);
      } catch (error: unknown) {
        setError((error as Error).message || "Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    getFeedVideos();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="w-full aspect-video rounded-xl bg-neutral-800" />
            <div className="flex gap-3 mt-3 px-1">
              <div className="w-9 h-9 rounded-full bg-neutral-800 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-neutral-800 rounded w-11/12" />
                <div className="h-3 bg-neutral-800 rounded w-2/3" />
                <div className="h-3 bg-neutral-800 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-red-400 text-lg mb-2 font-medium">Something went wrong</p>
        <p className="text-neutral-500 text-sm mb-6 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center">
        <div className="w-20 h-20 mb-4 rounded-full bg-neutral-800/60 flex items-center justify-center">
          <svg className="w-10 h-10 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-neutral-300 text-lg font-medium">No videos yet</p>
        <p className="text-neutral-500 text-sm mt-1">Check back later for new content!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
      {videos.map((video) => (
        <VideoCard key={video._id} {...video} />
      ))}
    </div>
  );
};

export default Homepage;
