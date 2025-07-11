"use client";
import React, { useState, useEffect, useRef } from "react";
import "plyr/dist/plyr.css";
import dynamic from "next/dynamic";
const Plyr = dynamic(() => import("plyr"), { ssr: false });
export default function VideoPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("");
  const [showUrlId, setShowUrlId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ loading 狀態

  const videoRefs = useRef({});

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true); // 開始載入
      try {
        const res = await fetch(`${baseUrl}/api/video`, { cache: "no-store" });
        const data = await res.json();
        setVideos(data);
        setFilteredVideos(data);
      } catch (err) {
        console.error("載入影片失敗：", err);
      } finally {
        setIsLoading(false); // 完成載入
      }
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    const filtered = videos.filter((video) => {
      const matchesSearch =
        search === "" ||
        video.name.toLowerCase().includes(search.toLowerCase()) ||
        video.song.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "" || video.type.includes(typeFilter);
      const matchesYear =
        yearFilter === "" || video.year === parseInt(yearFilter);
      const matchesSeason =
        seasonFilter === "" || video.season === seasonFilter;
      return matchesSearch && matchesType && matchesYear && matchesSeason;
    });
    setFilteredVideos(filtered);
  }, [search, typeFilter, yearFilter, seasonFilter, videos]);

  // 初始化 Plyr
  useEffect(() => {
    const el = videoRefs.current[showUrlId];
    if (showUrlId && el) {
      const timeout = setTimeout(() => {
        try {
          new Plyr(el, {
            controls: ["play", "progress", "mute", "volume", "fullscreen"],
          });
        } catch (err) {
          console.error("Plyr 初始化失敗:", err);
        }
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [showUrlId]);

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      <h1
        style={{
          fontSize: "2.25rem",
          fontWeight: "700",
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        🎬 影片清單
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <input
          type="text"
          placeholder="搜尋影片或歌曲"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <option value="">所有類型</option>
          <option value="OP">OP</option>
          <option value="ED">ED</option>
        </select>
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <option value="">所有年份</option>
          {[...new Set(videos.map((v) => v.year))].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          value={seasonFilter}
          onChange={(e) => setSeasonFilter(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <option value="">所有季度</option>
          <option value="spring">春</option>
          <option value="summer">夏</option>
          <option value="fall">秋</option>
          <option value="winter">冬</option>
        </select>
      </div>

      {/* ✅ loading 狀態 */}
      {isLoading ? (
        <p style={{ textAlign: "center", color: "#555", fontSize: "1.25rem" }}>
          載入中...
        </p>
      ) : filteredVideos.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            fontStyle: "italic",
            color: "#999",
            fontSize: "1.125rem",
          }}
        >
          目前沒有符合條件的影片
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {filteredVideos.map((video) => {
            const isShowing = showUrlId === video.$id;
            return (
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
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
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
                    fontWeight: "600",
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

                  <button
                    onClick={() => setShowUrlId(isShowing ? null : video.$id)} // ✅ 只顯示一個
                    style={{
                      backgroundColor: isShowing ? "#dc2626" : "#4f46e5",
                      color: "white",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = isShowing
                        ? "#b91c1c"
                        : "#4338ca")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = isShowing
                        ? "#dc2626"
                        : "#4f46e5")
                    }
                  >
                    {isShowing ? "🔒 隱藏內嵌影片" : "🎥 顯示內嵌影片"}
                  </button>
                </div>

                {isShowing && video.url && (
                  <video
                    ref={(el) => (videoRefs.current[video.$id] = el)}
                    src={video.url}
                    controls
                    style={{
                      width: "100%",
                      maxHeight: "180px",
                      borderRadius: "6px",
                      marginTop: "1rem",
                    }}
                  />
                )}
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
