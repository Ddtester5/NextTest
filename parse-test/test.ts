import { chromium } from "playwright";
import { parseNewsFromOnePage } from "./parse_fn/get_news_from_one_page";
import { setupDirectories } from "./parse_fn/setup_dirs";

(async () => {
  await setupDirectories();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await parseNewsFromOnePage(page);
})();
