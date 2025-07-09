"use client";
import React, { useState, useEffect } from "react";

export default function VideoPage() {
  const [videos, setVideos] = useState([]);
  const [showUrl, setShowUrl] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(`${baseUrl}/api/video`, { cache: "no-store" });
      const data = await res.json();
      setVideos(data);
    };

    fetchVideos();
  }, []);

  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "2.25rem",
          fontWeight: 700,
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        🎬 影片清單
      </h1>

      {videos.length === 0 && (
        <p
          style={{
            textAlign: "center",
            fontStyle: "italic",
            color: "#999",
            fontSize: "1.125rem",
          }}
        >
          目前沒有影片資料
        </p>
      )}

      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {videos.map((video) => (
          <article
            key={video.$id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              padding: "1rem",
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <img
              src={video.img}
              alt={video.name}
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            />
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              {video.name}
            </h2>
            <p style={{ marginBottom: "0.25rem", color: "#555" }}>
              🎵 {video.song} - {video.type}
            </p>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#777",
                marginBottom: "1rem",
              }}
            >
              📅 {video.season} / {video.year}
            </p>

            <div
              style={{
                marginTop: "auto",
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              {video.watch && (
                <a
                  href={video.watch}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#2563eb", textDecoration: "underline" }}
                >
                  🌐 觀看
                </a>
              )}
              {video.youtube && (
                <a
                  href={video.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#dc2626", textDecoration: "underline" }}
                >
                  ▶ YouTube
                </a>
              )}
              {showUrl && video.url && (
                <video
                  src={video.url}
                  controls
                  style={{
                    width: "100%",
                    maxHeight: 180,
                    borderRadius: "6px",
                    marginTop: "1rem",
                  }}
                />
              )}
            </div>
          </article>
        ))}
      </div>

      {videos.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            onClick={() => setShowUrl((prev) => !prev)}
            style={{
              backgroundColor: "#4f46e5",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#4338ca")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#4f46e5")
            }
          >
            {showUrl ? "🔒 隱藏內嵌影片" : "🎥 顯示內嵌影片"}
          </button>
        </div>
      )}
    </main>
  );
}
