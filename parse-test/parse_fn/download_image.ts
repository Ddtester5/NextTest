import path from "path";
import fs from "fs";
import { IMG_DIR } from "./const";
import axios from "axios";

export const downloadImage = async (
  url: string,
  filename: string,
  imgType: string,
) => {
  try {
    const imagePath = path.join(IMG_DIR, imgType, filename);
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      },
    });
    fs.writeFileSync(imagePath, Buffer.from(response.data));
    console.log(`Image downloaded: ${imagePath}`);
    return imagePath;
  } catch (error) {
    console.warn("Failed to download image:", url, error);
    return null;
  }
};
