"use client";

import { useEffect, useRef , useState } from "react";
import { useRouter } from "next/router";

interface VideoPlayerProps {
  video: {
    _id: string;
    videotitle: string;
    filepath: string;
  };
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const clickCount = useRef(0);
const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const player = videoRef.current;
    if (!player) return;

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    const plan = storedUser.subscriptionPlan || "Free";

    let limit = Infinity;

    switch (plan) {
      case "Free":
        limit = 300; // 5 min
        break;
      case "Bronze":
        limit = 420; // 7 min
        break;
      case "Silver":
        limit = 600; // 10 min
        break;
      case "Gold":
        limit = Infinity;
        break;
    }

    const handleTimeUpdate = () => {
      if (player.currentTime >= limit) {
        player.pause();

        alert(
          "Your watch limit has been reached. Please upgrade your subscription."
        );

        router.push("/subscription");
      }
    };

    player.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      player.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [router]);
const handleGesture = (e: React.MouseEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.stopPropagation();

  const player = videoRef.current;
  if (!player) return;

  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const width = rect.width;

  let zone = "center";

  if (x < width / 3) zone = "left";
  else if (x > (2 * width) / 3) zone = "right";

  clickCount.current++;

  if (clickTimer.current) clearTimeout(clickTimer.current);

  clickTimer.current = setTimeout(() => {
    const taps = clickCount.current;

    if (taps === 1) {
      if (zone === "center") {
        if (player.paused) player.play();
        else player.pause();
      }
    }

    else if (taps === 2) {
      if (zone === "left") {
        player.currentTime = Math.max(0, player.currentTime - 10);
      }

      if (zone === "right") {
        player.currentTime = Math.min(
          player.duration,
          player.currentTime + 10
        );
      }
    }

    else if (taps >= 3) {
      if (zone === "center") {
        router.push("/");
      }

      if (zone === "left") {
        document
          .getElementById("comments")
          ?.scrollIntoView({ behavior: "smooth" });
      }

      if (zone === "right") {
        if (window.confirm("Close Website?")) {
          window.close();
          router.push("/");
        }
      }
    }

    clickCount.current = 0;
  }, 250);
};
  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden"
    onClick={handleGesture}>
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        autoPlay
      >
        <source
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${video.filepath.replace(
            /\\/g,
            "/"
          )}`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}