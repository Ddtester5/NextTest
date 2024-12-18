import { chromium, Page } from "playwright";
import fs from "fs";
import path from "path";
import { setupDirectories } from "./parse_fn/utils/setup_dirs";

// Парсинг обзоров
async function parseReviews(page: Page) {
  console.log("Parsing reviews...");
  await page.goto("https://www.gsmarena.com/reviews.php3", {
    waitUntil: "domcontentloaded",
  });

  const reviews = await page
    .locator(".review-item")
    .evaluateAll(async (elements) =>
      elements.map((el) => ({
        title: el.querySelector(".review-item-title")?.textContent?.trim(),
        link: el.querySelector("a")?.getAttribute("href"),
        previewImage: el.querySelector("img")?.getAttribute("src"),
      })),
    );

  const parsedReviews = [];
  for (const review of reviews) {
    if (!review.link) continue;
    await page.goto(`https://www.gsmarena.com/${review.link}`);
    const content = await page.locator(".article-info").textContent();
    const tags = await page
      .locator(".tag-list a")
      .evaluateAll((tags) => tags.map((tag) => tag.textContent?.trim()));
    const images = await page
      .locator(".article-content img")
      .evaluateAll((imgs) => imgs.map((img) => img.getAttribute("src")));

    const previewPath = review.previewImage
      ? await downloadImage(
          page,
          review.previewImage,
          path.basename(review.previewImage),
        )
      : null;

    const contentImages = [];
    for (const img of images) {
      if (img) {
        const savedPath = await downloadImage(page, img, path.basename(img));
        if (savedPath) contentImages.push(savedPath);
      }
    }

    parsedReviews.push({
      title: review.title,
      content,
      previewImage: previewPath,
      contentImages,
      tags,
    });
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "reviews.json"),
    JSON.stringify(parsedReviews, null, 2),
  );
  console.log("Reviews parsed and saved.");
}

// Парсинг брендов
async function parseBrands(page: Page) {
  console.log("Parsing brands...");
  await page.goto("https://www.gsmarena.com/makers.php3", {
    waitUntil: "domcontentloaded",
  });

  const brands = await page.locator("td a").evaluateAll((elements) =>
    elements.map((el) => ({
      name: el.querySelector("strong")?.textContent?.trim(),
      link: `https://www.gsmarena.com/${el.getAttribute("href")}`,
    })),
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "brands.json"),
    JSON.stringify(brands, null, 2),
  );
  console.log("Brands parsed and saved.");
}

// Парсинг устройств
async function parseDevices(page: Page, brandLink: string) {
  console.log("Parsing devices...");
  await page.goto(brandLink, { waitUntil: "domcontentloaded" });

  const devices = await page.locator(".makers a").evaluateAll((elements) =>
    elements.map((el) => ({
      name: el.querySelector("span")?.textContent?.trim(),
      link: `https://www.gsmarena.com/${el.getAttribute("href")}`,
      previewImage: el.querySelector("img")?.getAttribute("src"),
    })),
  );

  const devicesWithDetails = [];
  for (const device of devices) {
    if (!device.link) continue;
    await page.goto(device.link);

    const specs = await page
      .locator(".specs-brief-accent, .specs-cp-value")
      .evaluateAll((elements) => {
        const result: Record<string, string> = {};
        let key: string | null = null;

        elements.forEach((el) => {
          if (el.classList.contains("specs-brief-accent"))
            key = el.textContent?.trim();
          else if (key) result[key] = el.textContent?.trim();
        });
        return result;
      });

    const imagePath = device.previewImage
      ? await downloadImage(
          page,
          device.previewImage,
          path.basename(device.previewImage),
        )
      : null;

    devicesWithDetails.push({ ...device, specs, imagePath });
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "devices.json"),
    JSON.stringify(devicesWithDetails, null, 2),
  );
  console.log("Devices parsed and saved.");
}

(async () => {
  await setupDirectories();

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await parseNews(page);
    await parseReviews(page);
    await parseBrands(page);
    // Пример парсинга устройств для конкретного бренда:
    await parseDevices(page, "https://www.gsmarena.com/samsung-phones-9.php");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
})();
