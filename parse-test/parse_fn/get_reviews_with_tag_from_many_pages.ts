import { Page } from "playwright";
import { downloadImage } from "./utils/download_image";
import path from "path";
import fs from "fs";
import { DATA_DIR } from "./utils/const";

export const parseReviewsFromManyPages = async (page: Page, n: number) => {
  const reviews = [];
  for (let i = 1; i <= n; i++) {
    console.log(`Parsing reviews from page ${i}`);
    await page.goto(`https://www.gsmarena.com/reviews.php3?iPage=${i}`, {
      waitUntil: "domcontentloaded",
    });

    const articles = await page
      .locator(".review-item")
      .evaluateAll((elements) =>
        elements.map((el) => ({
          titleForImg: el
            .querySelector(".review-item-content > h3")
            ?.textContent?.trim(),
          title: el
            .querySelector(".review-item-content > h3")
            ?.textContent?.trim(),
          link: el
            .querySelector(".review-item-media-wrap > a")
            ?.getAttribute("href"),
          previewImageUrl: el
            .querySelector(".review-item-media-wrap > a > img")
            ?.getAttribute("src"),
        })),
      );

    for (const article of articles) {
      if (!article.link) continue;

      const contentPages: string[] = [];
      const allImages: string[] = [];
      let currentUrl: string | null =
        `https://www.gsmarena.com/${article.link}`;

      // Обработка всех страниц обзора
      while (currentUrl) {
        await page.goto(currentUrl, { waitUntil: "domcontentloaded" });

        // Извлечение текста текущей страницы
        const content = await page.locator(".review-body p").allTextContents();
        contentPages.push(...content);

        // Извлечение изображений текущей страницы
        const imagesSrc = (await page
          .locator(".review-body > img")
          .evaluateAll((imgs) =>
            imgs
              .map((img) => img.getAttribute("src"))
              .filter((src) => src !== null),
          )) as string[];
        allImages.push(...imagesSrc);

        // Проверка на наличие кнопки "Next page"
        const nextPageElement = await page.locator(".pages-next").nth(0);
        const isDisabled = await nextPageElement.evaluate(
          (el) =>
            el.classList.contains("disabled") ||
            el.getAttribute("href") === "#",
        );

        if (isDisabled) {
          currentUrl = null; // Завершаем цикл
        } else {
          currentUrl = await nextPageElement.getAttribute("href");
          if (currentUrl) {
            currentUrl = `https://www.gsmarena.com/${currentUrl}`;
          }
        }
      }

      // Извлечение тегов
      const tags = await page
        .locator(".article-tags .float-right a")
        .evaluateAll((tags) =>
          tags.map((tag) => tag.textContent?.trim().toLowerCase()),
        );

      // Сохранение превью изображения
      const previewPath = article.previewImageUrl
        ? await downloadImage(
            article.previewImageUrl,
            article.titleForImg,
            "reviews_preview",
          )
        : null;

      // Сохранение всех изображений из обзора
      const contentImagesPaths = [];
      for (const imgSrc of allImages) {
        if (imgSrc) {
          const savedPath = await downloadImage(
            imgSrc,
            article.titleForImg,
            "reviews",
          );
          if (savedPath) contentImagesPaths.push(savedPath);
        }
      }

      // Добавляем данные обзора
      reviews.push({
        title: article.title,
        content: contentPages.join(" "), // Объединяем весь текст из всех страниц
        previewImage: previewPath,
        images: contentImagesPaths,
        tags,
      });
    }
  }
  // Сохранение данных в JSON
  fs.writeFileSync(
    path.join(DATA_DIR, "reviews.json"),
    JSON.stringify(reviews.reverse(), null, 2),
  );
};
