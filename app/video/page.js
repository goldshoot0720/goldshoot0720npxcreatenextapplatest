"use client";
import React, { useState, useEffect } from "react";

export default function VideoPage() {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("");
  const [showUrl, setShowUrl] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await fetch(
        "https://goldshoot0720npxcreatenextapplatest.vercel.app/api/video",
        {
          cache: "no-store",
        }
      );
      const data = await res.json();
      setVideos(data);
      setFilteredVideos(data);
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

  return (
    <main className="max-w-6xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-center mb-8">🎬 影片清單</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          placeholder="搜尋影片或歌曲"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">所有類型</option>
          <option value="OP">OP 映像</option>
          <option value="ED">ED 映像</option>
          <option value="オープニング">オープニング</option>
          <option value="エンディング">エンディング</option>
        </select>
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="border p-2 rounded w-full"
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
          className="border p-2 rounded w-full"
        >
          <option value="">所有季度</option>
          <option value="spring">春</option>
          <option value="summer">夏</option>
          <option value="fall">秋</option>
          <option value="winter">冬</option>
        </select>
      </div>

      {filteredVideos.length === 0 ? (
        <p className="text-center italic text-gray-500 text-lg">
          目前沒有符合條件的影片
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVideos.map((video) => (
            <div
              key={video.$id}
              className="bg-white border rounded-2xl shadow p-4 flex flex-col hover:scale-[1.02] transition-transform"
            >
              <img
                src={video.img}
                alt={video.name}
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
              <h2 className="text-lg font-semibold mb-1">{video.name}</h2>
              <p className="text-gray-700 mb-1">
                🎵 {video.song} - {video.type}
              </p>
              <p className="text-sm text-gray-500 mb-3">
                📅 {video.season} / {video.year}
              </p>
              <div className="mt-auto flex gap-4 flex-wrap">
                {video.watch && (
                  <a
                    href={video.watch}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    🌐 觀看
                  </a>
                )}
                {video.youtube && (
                  <a
                    href={video.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 underline"
                  >
                    ▶ YouTube
                  </a>
                )}
              </div>
              {showUrl && video.url && (
                <video
                  src={video.url}
                  controls
                  className="w-full max-h-48 rounded mt-4"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {filteredVideos.length > 0 && (
        <div className="text-center mt-10">
          <button
            onClick={() => setShowUrl((prev) => !prev)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-base hover:bg-indigo-700"
          >
            {showUrl ? "🔒 隱藏內嵌影片" : "🎥 顯示內嵌影片"}
          </button>
        </div>
      )}
    </main>
  );
}
