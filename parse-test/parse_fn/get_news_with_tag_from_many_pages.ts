import { Page } from "playwright";
import { downloadImage } from "./utils/download_image";
import path from "path";
import fs from "fs";
import { DATA_DIR } from "./utils/const";
import { translateAndUnicTitle } from "./utils/openai/translate_and_untc_title";
import { translateAndUnicText } from "./utils/openai/translate_and_untc_content";
import { translateTags } from "./utils/openai/translate_tags";
import { generateDataForPost } from "./utils/generate_data_for_post";

export const parseNewsFromManyPages = async (page: Page, n: number) => {
  const news = [];
  for (let i = 1; i <= n; i++) {
    console.log(`Parsing news from page ${i}`);

    await page.goto(`https://www.gsmarena.com/news.php3?iPage=${i}`, {
      waitUntil: "domcontentloaded",
    });

    const articles = await page.locator(".news-item").evaluateAll((elements) =>
      elements.map((el) => ({
        titleForImg: el.querySelector("a > h3")?.textContent?.trim(),
        title: el.querySelector("a > h3")?.textContent?.trim(),
        link: el.querySelector("a")?.getAttribute("href"),
        previewImageUrl: el.querySelector("img")?.getAttribute("src"),
      })),
    );
    for (const article of articles) {
      if (!article.link) continue;
      await page.goto(`https://www.gsmarena.com/${article.link}`);
      const date = await page.locator(".float-left .dtreviewed").textContent();
      const generatedDate = date
        ? generateDataForPost(date)
        : new Date((Math.floor(Date.now() / 1000) - 2678400) * 1000);
      const content = await page.locator(".review-body p").allTextContents();
      const contentRes = content.join(" ");
      const tags = await page
        .locator(".article-tags .float-right a")
        .evaluateAll((tags) =>
          tags
            .map((tag) => tag.textContent?.trim().toLowerCase())
            .filter((tag) => tag !== undefined),
        );
      const imagesSrc = await page
        .locator(".review-body > img")
        .evaluateAll((imgs) =>
          imgs.map((img) => img.getAttribute("src")).filter((e) => e !== null),
        );
      // Сохранение превью и всех картинок
      const previewPath = article.previewImageUrl
        ? await downloadImage(
            article.previewImageUrl,
            article.titleForImg,
            "news_preview",
          )
        : null;

      const contentImagesPaths = [];
      for (const imgSrc of imagesSrc) {
        if (imgSrc) {
          const savedPath = await downloadImage(
            imgSrc,
            article.titleForImg,
            "news",
          );
          if (savedPath) contentImagesPaths.push(savedPath);
        }
      }
      const translatedTitle = article.title
        ? await translateAndUnicTitle(article.title)
        : "";
      const translatedContent = await translateAndUnicText(contentRes);
      const translatedTags = await translateTags(tags);
      news.push({
        date: generatedDate,
        title: translatedTitle ? translatedTitle.replace(/\\"/g, "") : "",
        content: translatedContent ? translatedContent.replace(/\\"/g, "") : "",
        previewImage: previewPath,
        images: contentImagesPaths,
        tags: translatedTags
          ? JSON.parse(translatedTags.replace(/\\"/g, '"'))
          : [],
      });
    }
  }
  fs.writeFileSync(
    path.join(DATA_DIR, "news.json"),
    JSON.stringify(news.reverse(), null, 2),
  );
};
