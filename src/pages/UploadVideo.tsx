import { Upload, Video } from "lucide-react"
import toast from "react-hot-toast"
import React, { useState } from "react"
import { uploadVideo } from "../api/video.api";

export const UploadVideo = () => {

    const [videoTitle, setVideoTitle] = useState("")
    const [videoDescription, setVideoDescription] = useState("")
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [videoThumbnail, setVideoThumbnail] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    const handleUploadVideo = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
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
        }catch(error){
            setIsUploading(false);
            console.error("Upload failed:", error);
            toast.error("Failed to upload video");
        }
    }

    return (
        <form className="flex flex-col justify-center items-center gap-7 my-auto min-h-screen" onSubmit={handleUploadVideo}>
            <h1 className="text-center text-4xl font-bold font-sans mb-12">Upload a video on Vidtube</h1>
            <input
                placeholder="Video Title"
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="w-full max-w-3xl bg-transparent px-5 py-4 border border-white rounded-xl focus:outline-none hover:border-gray-400/60 transition-colors ease-linear duration-300"
                required
            />
            <textarea
                placeholder="Video Description"
                value={videoDescription}
                rows={4}
                onChange={(e) => setVideoDescription(e.target.value)}
                className="w-full max-w-3xl bg-transparent px-5 py-2 border border-white rounded-xl focus:outline-none hover:border-gray-400/60 transition-colors ease-linear duration-300"
            />
            <div className="flex gap-4 w-full max-w-3xl">
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
                        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl cursor-pointer transition-colors ease-linear duration-300 w-full ${videoFile ? 'border-green-500/60 h-[120px]' : 'px-4 py-12 hover:border-gray-400/60'}`}
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
                        className={`flex flex-col overflow-hidden items-center justify-center gap-2 border-2 border-dashed rounded-xl cursor-pointer transition-colors ease-linear duration-300 w-full ${videoThumbnail ? 'border-green-500/60 h-[120px]' : 'px-4 py-12 hover:border-gray-400/60'}`}
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
            <button
                type="submit"
                disabled={isUploading}
                className="w-full max-w-3xl bg-transparent px-5 py-2 border border-white rounded-xl focus:outline-none hover:border-gray-400/60 transition-colors ease-linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >{isUploading ? "Uploading..." : "Upload"}</button>
        </form>
    )
}