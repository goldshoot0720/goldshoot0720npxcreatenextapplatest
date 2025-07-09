// app/server/api/video/route.js
import { NextResponse } from "next/server";
import { Client, Databases } from "appwrite";
export const runtime = "edge";
const client = new Client();

client
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // ⛳ 請換成你的 Appwrite Endpoint
  .setProject("680c76af0037a7d23e44"); // ⛳ 請換成你的 Project ID

const databases = new Databases(client);
const databaseId = "680c778b000f055f6409"; // ✅ 你提供的資料庫 ID
const collectionId = "686beea30020d8ea151f"; // ✅ 你提供的 collection ID

export async function GET() {
  try {
    const response = await databases.listDocuments(databaseId, collectionId);
    return new NextResponse(JSON.stringify(response.documents), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // 或指定來源
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // 同樣加入
      },
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      url,
      img,
      type,
      date,
      song,
      site,
      watch,
      youtube,
      year,
      season,
    } = body;

    const document = await databases.createDocument(
      databaseId,
      collectionId,
      "unique()",
      { name, url, img, type, date, song, site, watch, youtube, year, season }
    );

    return new NextResponse(JSON.stringify(document), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
