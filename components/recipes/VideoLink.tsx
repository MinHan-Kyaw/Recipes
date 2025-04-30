"use client";

import React, { useState } from "react";
import { Video, Youtube, Link, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface VideoLinkProps {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
}

export const VideoLink: React.FC<VideoLinkProps> = ({
  videoUrl,
  setVideoUrl,
}) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateUrl = (url: string) => {
    if (!url) {
      setIsValid(null);
      return;
    }

    try {
      new URL(url);

      // Basic validation for common video platforms
      const isYoutube = url.includes("youtube.com") || url.includes("youtu.be");
      const isVimeo = url.includes("vimeo.com");
      const isTiktok = url.includes("tiktok.com");

      setIsValid(isYoutube || isVimeo || isTiktok);
    } catch (e) {
      setIsValid(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    validateUrl(url);
  };

  const getVideoIcon = () => {
    if (!videoUrl) return <Video size={20} className="text-gray-400" />;

    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      return <Youtube size={20} className="text-red-500" />;
    }

    if (videoUrl.includes("vimeo.com")) {
      return <Video size={20} className="text-blue-500" />;
    }

    if (videoUrl.includes("tiktok.com")) {
      return <Video size={20} className="text-black" />;
    }

    return <Link size={20} className="text-gray-500" />;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="video-url" className="text-sm font-medium">
        Video Tutorial Link (Optional)
      </Label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {getVideoIcon()}
        </div>
        <Input
          id="video-url"
          type="url"
          value={videoUrl}
          onChange={handleChange}
          placeholder="e.g. https://www.youtube.com/watch?v=..."
          className="pl-10 pr-10"
        />
        {videoUrl && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid === true && (
              <span className="text-green-500 text-xs">Valid URL</span>
            )}
            {isValid === false && (
              <span className="text-red-500 text-xs">Invalid URL</span>
            )}
            {videoUrl && isValid && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-1"
                onClick={() => window.open(videoUrl, "_blank")}
              >
                <ExternalLink size={14} />
              </Button>
            )}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Add a link to a video tutorial from YouTube, Vimeo, TikTok, or other
        video platforms
      </p>
    </div>
  );
};
