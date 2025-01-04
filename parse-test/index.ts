import { chromium } from "playwright";
import { setupDirectories } from "./parse_fn/utils/setup_dirs";

import { parseNewsFromManyPages } from "./parse_fn/get_news_with_tag_from_many_pages";
import { parseReviewsFromManyPages } from "./parse_fn/get_reviews_with_tag_from_many_pages";

(async () => {
  await setupDirectories();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await parseNewsFromManyPages(page, 1);
  await parseReviewsFromManyPages(page, 1);

  await browser.close();
})();
