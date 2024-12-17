import { Page } from "playwright";
import { downloadImage } from "./download_image";
import path from "path";
import fs from "fs";
import { DATA_DIR } from "./const";

export const parseNewsFromOnePage = async (page: Page, url?: string | null) => {
  console.log("Parsing news...");
  await page.goto(url ? url : "https://www.gsmarena.com/news.php3", {
    waitUntil: "domcontentloaded",
  });

  const articles = await page.locator(".news-item").evaluateAll((elements) =>
    elements.map((el) => ({
      title: el.querySelector("h3")?.textContent?.trim(),
      link: el.querySelector("a")?.getAttribute("href"),
      previewImageUrl: el.querySelector("img")?.getAttribute("src"),
    })),
  );
  const news = [];
  for (const article of articles) {
    if (!article.link) continue;
    await page.goto(`https://www.gsmarena.com/${article.link}`);
    const content = await page.locator(".review-body p").allTextContents();
    content.pop();
    const tags = await page
      .locator(".article-tags .float-right a")
      .evaluateAll((tags) => tags.map((tag) => tag.textContent?.trim()));
    const imagesSrc = await page
      .locator(".review-body img")
      .evaluateAll((imgs) => imgs.map((img) => img.getAttribute("src")));

    // Сохранение превью и всех картинок
    const previewPath = article.previewImageUrl
      ? await downloadImage(
          article.previewImageUrl,
          path.basename(article.previewImageUrl),
          "news_preview",
        )
      : null;

    const contentImages = [];
    for (const img of imagesSrc) {
      if (img) {
        const savedPath = await downloadImage(img, path.basename(img), "news");
        if (savedPath) contentImages.push(savedPath);
      }
    }

    news.push({
      title: article.title,
      content,
      previewPath: previewPath,
      contentImages,
      tags,
    });
  }

  fs.writeFileSync(
    path.join(DATA_DIR, "news.json"),
    JSON.stringify(news, null, 2),
  );
  console.log("News parsed and saved.");
};
