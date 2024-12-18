import { chromium } from "playwright";
import { parseNewsFromOnePage } from "./parse_fn/get_news_from_one_page";
import { setupDirectories } from "./parse_fn/utils/setup_dirs";
import { main } from "./parse_fn/utils/free_gpt";

(async () => {
  // await setupDirectories();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  // await parseNewsFromOnePage(page, "https://www.gsmarena.com/news.php3");
  main();
  await browser.close();
})();
