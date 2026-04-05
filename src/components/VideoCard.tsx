import { useState } from "react";
import { Link } from "react-router-dom";

interface VideoOwner {
  username: string;
  fullname: string;
  avatar?: string;
}

export interface VideoCardProps {
  _id: string;
  title: string;
  description?: string;
  thumbnail: string;
  videoFile?: string;
  owner: VideoOwner;
  views?: number;
  duration?: number;
  createdAt?: string;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(views);
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

const VideoCard = (props: VideoCardProps) => {
  const { _id, title, thumbnail, owner, views, duration, createdAt } = props;
  const [imgError, setImgError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const safeThumbnail = thumbnail?.replace("http://", "https://");
  const safeAvatar = owner?.avatar?.replace("http://", "https://");

  return (
    <Link
      to={`/video/${_id}`}
      state={{ video: props }}
      className="group block rounded-xl transition-all duration-200 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
    >
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-800">
        {!imgError ? (
          <img
            src={safeThumbnail}
            alt={title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-500">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {typeof duration === "number" && duration > 0 && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
            {formatDuration(duration)}
          </span>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 pointer-events-none" />
      </div>

      <div className="flex gap-3 mt-3 px-1">
        <div className="flex-shrink-0">
          {safeAvatar && !avatarError ? (
            <img
              src={safeAvatar}
              alt={owner?.username}
              onError={() => setAvatarError(true)}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
              {owner?.username?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-medium text-white leading-snug line-clamp-2 group-hover:text-purple-200 transition-colors">
            {title}
          </h3>
          <p className="text-[13px] text-neutral-400 mt-1 hover:text-neutral-300 transition-colors">
            {owner?.username ?? "Unknown"}
          </p>
          <p className="text-[13px] text-neutral-500">
            {typeof views === "number" && (
              <span>{formatViews(views)} views</span>
            )}
            {typeof views === "number" && createdAt && (
              <span className="mx-1">•</span>
            )}
            {createdAt && <span>{timeAgo(createdAt)}</span>}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
