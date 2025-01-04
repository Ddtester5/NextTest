import { mkdir } from "fs/promises";

export const setupDirectories = async () => {
  try {
    await mkdir("./img", { recursive: true });
    await mkdir(`./img/news`, { recursive: true });
    await mkdir(`./img/news_preview`, { recursive: true });
    await mkdir(`./img/reviews`, { recursive: true });
    await mkdir(`./img/reviews_preview`, { recursive: true });

    console.log(`Dirs created:
        ./img
        ./img/news
        ./img/news_preview
        ./img/reviews
        ./img/reviews_preview`);
  } catch (error) {}
};
