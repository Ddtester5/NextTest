import { chromium } from "playwright";
import { parseNewsFromOnePage } from "./parse_fn/get_news_with_tag_from_one_page";
import { setupDirectories } from "./parse_fn/utils/setup_dirs";
import { globalSeed } from "./parse_fn/utils/db_seed/global_seed";
import { dataBase } from "./parse_fn/utils/db_seed/db_connect";
import { parseNewsFromManyPages } from "./parse_fn/get_news_with_tag_from_many_pages";
import { parseReviewsFromOnePage } from "./parse_fn/get_reviews_with_tag_from_one_page";
import { parseReviewsFromManyPages } from "./parse_fn/get_reviews_with_tag_from_many_pages";
import { delay } from "./parse_fn/utils/db_seed/delay";
// import { deleteParseDirs } from "./parse_fn/utils/delete_parse_dir";

(async () => {
  await setupDirectories();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  // await page.goto("https://www.gsmarena.com/news.php3", {
  //   waitUntil: "domcontentloaded",
  // });
  // await page.screenshot({ path: 'screenshot.png' });
  await parseNewsFromOnePage(page);
  // await parseNewsFromManyPages(page, 2);
  // delay(1000);
  // await parseReviewsFromManyPages(page, 2);
  await browser.close();

  // globalSeed()
  //   .catch((e) => {
  //     console.error(e);
  //     dataBase.$disconnect();
  //   })
  //   .finally(() => {
  //     dataBase.$disconnect();
  //   });

  // deleteParseDirs();
})();
