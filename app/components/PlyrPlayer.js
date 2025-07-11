"use client";

import React, { useEffect, useRef } from "react";
import "plyr/dist/plyr.css";

export default function PlyrPlayer({ src }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    import("plyr").then(({ default: Plyr }) => {
      if (videoRef.current && mounted) {
        playerRef.current = new Plyr(videoRef.current, {
          controls: [
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "fullscreen",
          ],
        });
      }
    });

    return () => {
      mounted = false;
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      controls
      style={{ width: "100%", borderRadius: "8px", marginTop: "1rem" }}
    />
  );
}
