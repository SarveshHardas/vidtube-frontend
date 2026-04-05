import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { getAllVideos } from "../api/homefeed.api";
import VideoCard from "../components/VideoCard";
import type { VideoCardProps } from "../components/VideoCard";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Eye,
  CalendarDays,
  ArrowLeft,
} from "lucide-react";

interface VideoOwner {
  _id?: string;
  username: string;
  fullname: string;
  avatar?: string;
  subscribersCount?: number;
}

interface Video {
  _id: string;
  title: string;
  description?: string;
  thumbnail: string;
  videoFile?: string;
  owner: VideoOwner;
  views?: number;
  duration?: number;
  createdAt?: string;
  likes?: number;
  dislikes?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
}

function formatViews(views: number): string {
  if (views >= 1_000_000)
    return `${(views / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (views >= 1_000)
    return `${(views / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(views);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function timeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffSec = Math.floor((now - then) / 1000);
  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} minutes ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
  if (diffSec < 2592000) return `${Math.floor(diffSec / 86400)} days ago`;
  if (diffSec < 31536000) return `${Math.floor(diffSec / 2592000)} months ago`;
  return `${Math.floor(diffSec / 31536000)} years ago`;
}

function formatDurationShort(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

const VideoPage = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);

  const passedVideo = (location.state as { video?: Video })?.video ?? null;

  const [video, setVideo] = useState<Video | null>(passedVideo);
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(!passedVideo);
  const [error, setError] = useState<string | null>(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const [liked, setLiked] = useState(passedVideo?.isLiked ?? false);
  const [disliked, setDisliked] = useState(passedVideo?.isDisliked ?? false);

  useEffect(() => {
    if (!videoId) return;

    const fetchAllVideos = async () => {
      try {
        const res = await getAllVideos();
        const body = res.data;
        const inner = body?.data;
        const list: Video[] =
          Array.isArray(body) ? body :
            Array.isArray(inner) ? inner :
              Array.isArray(inner?.docs) ? inner.docs :
                Array.isArray(inner?.videos) ? inner.videos :
                  Array.isArray(body?.videos) ? body.videos :
                    Array.isArray(body?.docs) ? body.docs :
                      [];

        setAllVideos(list);

        if (!passedVideo) {
          const found = list.find((v) => v._id === videoId);
          if (found) {
            setVideo(found);
            setLiked(found.isLiked ?? false);
            setDisliked(found.isDisliked ?? false);
          } else {
            setError("Video not found");
          }
          setLoading(false);
        }
      } catch {
        if (!passedVideo) {
          setError("Failed to load video");
          setLoading(false);
        }
      }
    };

    fetchAllVideos();
    window.scrollTo(0, 0);
  }, [videoId, passedVideo]);

  const suggestedVideos = allVideos.filter((v) => v._id !== videoId);

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } catch {
      alert("Failed to copy link");
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1800px] mx-auto px-4 lg:px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 animate-pulse">
            <div className="w-full aspect-video rounded-xl bg-neutral-800" />
            <div className="mt-4 space-y-3">
              <div className="h-6 bg-neutral-800 rounded w-3/4" />
              <div className="h-4 bg-neutral-800 rounded w-1/2" />
              <div className="flex gap-3 mt-4">
                <div className="w-10 h-10 rounded-full bg-neutral-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-neutral-800 rounded w-1/3" />
                  <div className="h-3 bg-neutral-800 rounded w-1/4" />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[400px] xl:w-[420px] space-y-4 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-2">
                <div className="w-40 aspect-video rounded-lg bg-neutral-800 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-neutral-800 rounded w-full" />
                  <div className="h-3 bg-neutral-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-red-400 text-lg mb-2 font-medium">
          {error || "Video not found"}
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors text-sm font-medium inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>
    );
  }

  const safeVideoUrl = video.videoFile?.replace("http://", "https://");
  const safeAvatar = video.owner?.avatar?.replace("http://", "https://");

  return (
    <div className="max-w-[1800px] mx-auto px-4 lg:px-6">
      <div className="flex flex-col lg:flex-row gap-6">

        <div className="flex-1 min-w-0">

          <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
            <video
              ref={videoRef}
              src={safeVideoUrl}
              poster={video.thumbnail?.replace("http://", "https://")}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="text-xl font-semibold text-white mt-3 leading-snug">
            {video.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-3">

            <div className="flex items-center gap-3">
              {safeAvatar ? (
                <img
                  src={safeAvatar}
                  alt={video.owner?.username}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {video.owner?.username?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
              <div>
                <p className="text-white font-medium text-[15px] leading-tight">
                  {video.owner?.fullname || video.owner?.username || "Unknown"}
                </p>
                {typeof video.owner?.subscribersCount === "number" && (
                  <p className="text-neutral-400 text-xs">
                    {formatViews(video.owner.subscribersCount)} subscribers
                  </p>
                )}
              </div>
              <button className="ml-3 px-4 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-neutral-200 transition-colors">
                Subscribe
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-neutral-800 rounded-full overflow-hidden">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${liked ? "text-purple-400" : "text-white hover:bg-neutral-700"}`}
                >
                  <ThumbsUp className={`w-5 h-5 ${liked ? "fill-purple-400" : ""}`} />
                  {typeof video.likes === "number"
                    ? formatViews(video.likes + (liked ? 1 : 0))
                    : "Like"}
                </button>
                <div className="w-px h-6 bg-neutral-600" />
                <button
                  onClick={handleDislike}
                  className={`flex items-center px-3 py-2 transition-colors ${disliked ? "text-purple-400" : "text-white hover:bg-neutral-700"}`}
                >
                  <ThumbsDown className={`w-5 h-5 ${disliked ? "fill-purple-400" : ""}`} />
                </button>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-4 py-2 bg-neutral-800 rounded-full text-sm font-medium text-white hover:bg-neutral-700 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>

              <button className="flex items-center gap-1.5 px-4 py-2 bg-neutral-800 rounded-full text-sm font-medium text-white hover:bg-neutral-700 transition-colors">
                <Download className="w-5 h-5" />
                Download
              </button>

              <button className="p-2 bg-neutral-800 rounded-full text-white hover:bg-neutral-700 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 transition-colors">
            <div className="flex items-center gap-3 text-sm text-neutral-300 font-medium">
              {typeof video.views === "number" && (
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {formatViews(video.views)} views
                </span>
              )}
              {video.createdAt && (
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  {timeAgo(video.createdAt)}
                </span>
              )}
              {video.createdAt && (
                <span className="text-neutral-500 text-xs hidden sm:inline">
                  {formatDate(video.createdAt)}
                </span>
              )}
            </div>

            {video.description && (
              <div className="mt-2">
                <p className={`text-sm text-neutral-300 whitespace-pre-wrap ${!descExpanded ? "line-clamp-3" : ""}`}>
                  {video.description}
                </p>
                <button
                  onClick={() => setDescExpanded(!descExpanded)}
                  className="mt-1 text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  {descExpanded ? (
                    <>
                      Show less <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Show more <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 mb-8 p-4 rounded-xl border border-neutral-800">
            <h2 className="text-lg font-semibold text-white mb-2">Comments</h2>
            <p className="text-neutral-500 text-sm">Comments coming soon...</p>
          </div>
        </div>

        <div className="w-full lg:w-[400px] xl:w-[420px] flex-shrink-0">
          {suggestedVideos.length > 0 && (
            <>
              <h2 className="text-base font-semibold text-white mb-4 lg:hidden">
                Up next
              </h2>
              <div className="flex flex-col gap-2">
                {suggestedVideos.map((sv) => (
                  <SuggestedVideoCard key={sv._id} video={sv} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {suggestedVideos.length > 0 && (
        <div className="mt-8 lg:hidden">
          <h2 className="text-lg font-semibold text-white mb-4">More videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8">
            {suggestedVideos.slice(0, 6).map((sv) => (
              <VideoCard key={sv._id} {...(sv as VideoCardProps)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SuggestedVideoCard = ({ video }: { video: Video }) => {
  const safeThumbnail = video.thumbnail?.replace("http://", "https://");

  return (
    <Link
      to={`/video/${video._id}`}
      state={{ video }}
      className="group flex gap-2 rounded-lg p-1 hover:bg-white/5 transition-colors"
    >
      <div className="relative w-40 flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-neutral-800">
        <img
          src={safeThumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {typeof video.duration === "number" && video.duration > 0 && (
          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-medium px-1 py-0.5 rounded">
            {formatDurationShort(video.duration)}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0 py-0.5">
        <h3 className="text-[13px] font-medium text-white leading-snug line-clamp-2 group-hover:text-purple-200 transition-colors">
          {video.title}
        </h3>
        <p className="text-[12px] text-neutral-400 mt-1">
          {video.owner?.username ?? "Unknown"}
        </p>
        <p className="text-[11px] text-neutral-500">
          {typeof video.views === "number" && (
            <span>{formatViews(video.views)} views</span>
          )}
          {typeof video.views === "number" && video.createdAt && " • "}
          {video.createdAt && <span>{timeAgo(video.createdAt)}</span>}
        </p>
      </div>
    </Link>
  );
};

export default VideoPage;
