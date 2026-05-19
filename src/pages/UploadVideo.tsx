import { Upload, Video } from "lucide-react"
import toast from "react-hot-toast"
import React, { useState } from "react"
import { uploadVideo } from "../api/video.api";
import { useNavigate } from "react-router-dom";

export const UploadVideo = () => {
    const navigate = useNavigate();

    const [videoTitle, setVideoTitle] = useState("")
    const [videoDescription, setVideoDescription] = useState("")
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [videoThumbnail, setVideoThumbnail] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [page, setPage] = useState<1 | 2>(1)
    const [titleFilled, setTitleFilled] = useState(false)
    const [descFilled, setDescFilled] = useState(false)

    const handleUploadVideo = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("title", videoTitle);
            formData.append("description", videoDescription);
            if (videoFile) formData.append("videoFile", videoFile);
            if (videoThumbnail) formData.append("thumbnail", videoThumbnail);

            const response = await uploadVideo(formData);
            setIsUploading(false);
            console.log("Upload successful:", response.data);
            toast.success("Video uploaded successfully!");
            setVideoTitle("");
            setVideoDescription("");
            setVideoFile(null);
            setVideoThumbnail(null);
            navigate("/");
        } catch (error) {
            setIsUploading(false);
            console.error("Upload failed:", error);
            toast.error("Failed to upload video");
        }
    }

    return (
        <section>
            <div className="w-full max-w-md flex justify-center items-center gap-4 mx-auto">
                <div className={`px-2 py-1 rounded-full border border-gray-400 w-6 h-6 flex items-center justify-center text-xs ${page === 1 ? "border-gray-400/50 bg-gray-400/50" : "border-gray-400"}`}>1</div>
                <div className="border-b border-gray-400 w-full border-dashed" />
                <div className={`px-2 py-1 rounded-full border border-gray-400 w-6 h-6 flex items-center justify-center text-xs ${page === 2 ? "border-gray-400/50 bg-gray-400/50" : "border-gray-400"}`}>2</div>
            </div>
            <form className="flex flex-col justify-center items-center gap-7 mt-20 mb-10" onSubmit={handleUploadVideo}>
                {
                    page === 1 ? (
                        <>
                            <h1 className="text-center text-4xl font-bold font-sans mb-10">Upload a video on Vidtube</h1>
                            <input
                                placeholder="Video Title"
                                type="text"
                                value={videoTitle}
                                onChange={(e) => {
                                    setVideoTitle(e.target.value)
                                    setTitleFilled(true);
                                }}
                                className="w-full max-w-2xl bg-transparent px-5 py-4 border border-gray-400/60 rounded-xl focus:outline-none hover:border-white transition-colors ease-linear duration-300"
                                required
                            />
                            <textarea
                                placeholder="Video Description"
                                value={videoDescription}
                                rows={4}
                                onChange={(e) => {
                                    setVideoDescription(e.target.value)
                                    setDescFilled(true);
                                }}
                                className="w-full max-w-2xl bg-transparent px-5 py-2 border border-gray-400/60 rounded-xl focus:outline-none hover:border-white transition-colors ease-linear duration-300"
                            />
                            <button
                                type="submit"
                                disabled={isUploading || !titleFilled || !descFilled}
                                className="w-full max-w-2xl bg-transparent px-5 py-2 border border-gray-400/60 rounded-xl focus:outline-none hover:border-white transition-colors ease-linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setPage(2)}
                            >{isUploading ? "Wait..." : "Next"}</button>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-col gap-4 w-full max-w-2xl">
                                <div className="relative w-full">
                                    <input
                                        id="video-upload"
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                        required
                                    />
                                    <label
                                        htmlFor="video-upload"
                                        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl cursor-pointer transition-colors ease-linear duration-300 w-full ${videoFile ? 'border-green-500/60 h-[120px]' : 'px-4 py-12 border-gray-400/60 hover:border-white'}`}
                                    >
                                        {videoFile ? (
                                            <>
                                                <Video className="w-8 h-8 text-green-500" />
                                                <span className="text-sm text-green-500 truncate w-full text-center px-4">{videoFile.name}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-400">Upload Video</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                                <div className="relative w-full">
                                    <input
                                        id="thumbnail-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setVideoThumbnail(e.target.files?.[0] || null)}
                                        className="hidden"
                                        required
                                    />
                                    <label
                                        htmlFor="thumbnail-upload"
                                        className={`flex flex-col overflow-hidden items-center justify-center gap-2 border-2 border-dashed rounded-xl cursor-pointer transition-colors ease-linear duration-300 w-full ${videoThumbnail ? 'border-green-500/60 h-[120px]' : 'px-4 py-12 border-gray-400/60 hover:border-white'}`}
                                    >
                                        {videoThumbnail ? (
                                            <img src={URL.createObjectURL(videoThumbnail)} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-400">Upload Thumbnail</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-4 w-full max-w-2xl">
                                <button
                                    type="submit"
                                    onClick={() => setPage(1)}
                                    disabled={isUploading}
                                    className="w-full max-w-2xl bg-transparent px-5 py-2 border border-gray-400/60 rounded-xl focus:outline-none hover:border-white transition-colors ease-linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >{isUploading ? "Waiting..." : "Back"}</button>
                                <button
                                    type="submit"
                                    disabled={isUploading}
                                    className="w-full max-w-2xl bg-transparent px-5 py-2 border border-gray-400/60 rounded-xl focus:outline-none hover:border-white transition-colors ease-linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >{isUploading ? "Uploading..." : "Upload"}</button>
                            </div>
                        </>
                    )
                }
            </form>
        </section>
    )
}