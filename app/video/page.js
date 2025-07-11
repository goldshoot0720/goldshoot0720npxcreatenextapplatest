"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "plyr/dist/plyr.css";

// ⚠️ 使用 dynamic 並禁用 SSR，避免 hydration 錯誤
// PlyrPlayer 元件本身依賴瀏覽器 API，必須禁用 SSR。
const PlyrPlayer = dynamic(() => import("../components/PlyrPlayer"), {
  ssr: false,
});

export default function VideoPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // --- 狀態管理 ---
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 新增：用於追蹤資料載入狀態
  const [hasMounted, setHasMounted] = useState(false); // 新增：用於確保僅在客戶端渲染

  // 篩選器狀態
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("");
  const [showUrlId, setShowUrlId] = useState(null); // 控制哪個影片的播放器被顯示

  // --- 生命週期 Effect ---

  // 1. 標記元件已在客戶端掛載
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 2. 從 API 獲取影片資料
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/video`, { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to fetch videos");
        }
        const data = await res.json();
        setVideos(data);
        setFilteredVideos(data);
      } catch (error) {
        console.error(error);
        // 在此可以設置錯誤狀態來顯示錯誤訊息
      } finally {
        setIsLoading(false); // 無論成功或失敗，都結束載入狀態
      }
    };

    fetchVideos();
  }, [baseUrl]);

  // 3. 根據篩選條件更新顯示的影片
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

  // --- 渲染邏輯 ---

  // 在元件掛載到客戶端之前，不渲染任何動態內容，以避免 Hydration 錯誤
  if (!hasMounted) {
    // 伺服器端和客戶端首次渲染時都會執行到這裡，返回 null 或一個靜態的骨架屏 (Skeleton)
    // 這樣可以確保兩端渲染的 HTML 完全一致。
    return null;
  }

  return (
    <main
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "24px",
        fontFamily: "sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        🎬 影片清單
      </h1>

      {/* 篩選器 */}
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
          }}
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
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
          }}
        >
          <option value="">所有年份</option>
          {[...new Set(videos.map((v) => v.year))]
            .sort((a, b) => b - a)
            .map((year) => (
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
          }}
        >
          <option value="">所有季度</option>
          <option value="spring">春</option>
          <option value="summer">夏</option>
          <option value="fall">秋</option>
          <option value="winter">冬</option>
        </select>
      </div>

      {/* 內容清單 */}
      {isLoading ? (
        <p style={{ textAlign: "center", padding: "2rem" }}>載入中...</p>
      ) : filteredVideos.length === 0 ? (
        <p style={{ textAlign: "center", fontStyle: "italic", color: "#888" }}>
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
                  border: "1px solid #eee",
                  borderRadius: "12px",
                  padding: "1rem",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s",
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
                <h2 style={{ fontSize: "1.125rem", fontWeight: "600" }}>
                  {video.name}
                </h2>
                <p>
                  🎵 {video.song} - {video.type}
                </p>
                <p>
                  📅 {video.season} / {video.year}
                </p>

                <div
                  style={{
                    marginTop: "1rem",
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
                      style={{ color: "#2563eb" }}
                    >
                      🌐 觀看
                    </a>
                  )}
                  {video.youtube && (
                    <a
                      href={video.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#dc2626" }}
                    >
                      ▶ YouTube
                    </a>
                  )}
                  <button
                    onClick={() => setShowUrlId(isShowing ? null : video.$id)}
                    style={{
                      backgroundColor: isShowing ? "#dc2626" : "#4f46e5",
                      color: "#fff",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    {isShowing ? "🔒 隱藏影片" : "🎥 顯示影片"}
                  </button>
                </div>

                {/* PlyrPlayer 已經被 dynamic import 且 ssr:false，
                    這裡的 isShowing 判斷確保了它只在被點擊時渲染 */}
                {isShowing && video.url?.startsWith("http") && (
                  <div style={{ marginTop: "1rem" }}>
                    <PlyrPlayer src={video.url} />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
