import path from "path";
import fs from "fs";
import { IMG_DIR } from "./const";
import axios from "axios";
import { getImageName } from "./get_image_name";

export const downloadImage = async (
  url: string,
  textForFilename: string | undefined,
  imgDir: string,
) => {
  try {
    const imgName = getImageName(textForFilename);
    const imagePath = path.join(IMG_DIR, imgDir, imgName);
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      },
    });
    fs.writeFileSync(imagePath, Buffer.from(response.data));
    return imagePath;
  } catch (error) {
    console.warn("Failed to download image:", url, error);
    return null;
  }
};
