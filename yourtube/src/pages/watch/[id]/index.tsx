import Comments from "@/components/Comments";
import RelatedVideos from "@/components/RelatedVideos";
import VideoInfo from "@/components/VideoInfo";
import Videopplayer from "@/components/Videopplayer";
import axiosInstance from "@/lib/axiosinstance";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Index = () => {
  const router = useRouter();
  const { id } = router.query;

  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!router.isReady || !id || typeof id !== "string") return;

      try {
        const res = await axiosInstance.get("/video/getall");

        console.log("Current Video ID:", id);
        console.log("Videos:", res.data);

        const currentVideo = res.data.find(
          (vid: any) => vid._id.toString() === id
        );

        console.log("Selected Video:", currentVideo);

        setSelectedVideo(currentVideo);
        setAllVideos(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [router.isReady, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!selectedVideo) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        Video not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Videopplayer video={selectedVideo} />
            <VideoInfo video={selectedVideo} />
            <Comments videoId={selectedVideo._id} />
          </div>

          <div className="space-y-4">
            <RelatedVideos
              videos={allVideos.filter(
                (vid: any) => vid._id !== selectedVideo._id
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;