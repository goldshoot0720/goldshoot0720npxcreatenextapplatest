import { Client, Databases, Storage } from "appwrite";
const client = new Client();
client
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // 你的 Appwrite 端點
  .setProject("680c76af0037a7d23e44"); // 你的 Appwrite 專案 ID
const databases = new Databases(client);
const storage = new Storage(client);

export { client, databases, storage };
