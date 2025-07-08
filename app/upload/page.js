"use client";

import React, { useState } from "react";
import { storage, databases } from "../../lib/appwriteClient";
import { ID } from "appwrite";

const DATABASE_ID = "680c778b000f055f6409"; // 你的 Database ID
const COLLECTION_ID = "686beea30020d8ea151f"; // 你的 video Collection ID
const BUCKET_ID = "6867c5280021205ba9c0"; // 你的 Storage Bucket ID

export default function UploadVideoPage() {
  const [name, setName] = useState("");
  const [song, setSong] = useState("");
  const [type, setType] = useState("");
  const [year, setYear] = useState(2025);
  const [season, setSeason] = useState("spring");
  const [date, setDate] = useState("");
  const [site, setSite] = useState("");
  const [watch, setWatch] = useState("");
  const [youtube, setYoutube] = useState("");

  const [imgFile, setImgFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const uploadFile = async (file) => {
    const res = await storage.createFile(BUCKET_ID, ID.unique(), file);
    const url = `${storage.client.config.endpoint}/storage/buckets/${BUCKET_ID}/files/${res.$id}/view?project=${storage.client.config.project}`;
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !imgFile || !videoFile) {
      setMessage("請填寫名稱並選擇圖片和影片檔案");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      // 上傳圖片與影片
      const imgUrl = await uploadFile(imgFile);
      const videoUrl = await uploadFile(videoFile);

      // 新增文件到資料庫
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        name,
        img: imgUrl,
        url: videoUrl,
        type,
        date,
        song,
        site,
        watch,
        youtube,
        year: year ? parseInt(year) : null,
        season,
      });

      setMessage("新增成功！");
      // 清空欄位
      setName("");
      setSong("");
      setType("");
      setYear("");
      setSeason("");
      setDate("");
      setSite("");
      setWatch("");
      setYoutube("");
      setImgFile(null);
      setVideoFile(null);
    } catch (error) {
      setMessage("新增失敗: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>新增影片資料（含圖片、影片上傳）</h1>

      <form onSubmit={handleSubmit}>
        <label>
          名稱：
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <br />

        <label>
          歌曲：
          <input
            type="text"
            value={song}
            onChange={(e) => setSong(e.target.value)}
          />
        </label>

        <br />

        <label>
          類型：
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </label>

        <br />

        <label>
          年份：
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min={2020}
            max={2025}
            required
          />
        </label>

        <br />

        <label>
          季節：
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            required
          >
            <option value="spring">spring</option>
            <option value="summer">summer</option>
            <option value="fall">fall</option>
            <option value="winter">winter</option>
          </select>
        </label>

        <br />

        <label>
          日期：
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <br />

        <label>
          網站 URL：
          <input
            type="url"
            value={site}
            onChange={(e) => setSite(e.target.value)}
          />
        </label>

        <br />

        <label>
          觀看連結：
          <input
            type="url"
            value={watch}
            onChange={(e) => setWatch(e.target.value)}
          />
        </label>

        <br />

        <label>
          YouTube 連結：
          <input
            type="url"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
          />
        </label>

        <br />

        <label>
          封面圖片：
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImgFile(e.target.files[0])}
            required
          />
        </label>

        <br />

        <label>
          影片檔案：
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            required
          />
        </label>

        <br />

        <button type="submit" disabled={uploading}>
          {uploading ? "上傳中..." : "送出"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
