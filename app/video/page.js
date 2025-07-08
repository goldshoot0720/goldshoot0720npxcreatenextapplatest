import React from "react";

export default async function VideoPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/video`, { cache: "no-store" });
  const videos = await res.json();

  return (
    <>
      <style>{`
        main {
          max-width: 900px;
          margin: 0 auto;
          padding: 1.5rem;
        }
        h1 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media(min-width: 600px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media(min-width: 900px) {
          .grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        article {
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          background: white;
        }
        img {
          width: 100%;
          max-height: 150px;
          object-fit: cover;
          border-radius: 6px;
          margin-bottom: 0.75rem;
          flex-shrink: 0;
        }
        h2 {
          font-size: 1.125rem;
          margin: 0 0 0.5rem 0;
        }
        p {
          margin: 0 0 0.5rem 0;
          color: #444;
        }
        .meta {
          font-size: 0.8rem;
          color: #666;
          margin-bottom: 1rem;
        }
        .links {
          margin-top: auto;
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          font-size: 0.875rem;
        }
        .links a {
          color: #0066cc;
          text-decoration: underline;
        }
      `}</style>

      <main>
        <h1>🎬 影片清單</h1>

        {videos.length === 0 && (
          <p
            style={{ textAlign: "center", fontStyle: "italic", color: "#888" }}
          >
            目前沒有影片資料
          </p>
        )}

        <div className="grid">
          {videos.map((video) => (
            <article key={video.$id}>
              <img
                src={video.img}
                alt={video.name}
                loading="lazy"
                decoding="async"
              />
              <h2>{video.name}</h2>
              <p>
                {video.song} - {video.type}
              </p>
              <p className="meta">
                {video.season} / {video.year}
              </p>
              <div className="links">
                {video.watch && (
                  <a
                    href={video.watch}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    觀看
                  </a>
                )}
                {video.youtube && (
                  <a
                    href={video.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YouTube
                  </a>
                )}
                {video.url && (
                  <video
                    src={video.url}
                    controls
                    style={{ width: "100%", maxHeight: 150, borderRadius: 6 }}
                  />
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
