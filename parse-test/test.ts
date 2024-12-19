import { chromium } from "playwright";
import { parseNewsFromOnePage } from "./parse_fn/get_news_with_tag_from_one_page";
import { setupDirectories } from "./parse_fn/utils/setup_dirs";
import { globalSeed } from "./parse_fn/utils/db_seed/global_seed";
import { dataBase } from "./parse_fn/utils/db_seed/db_connect";


(async () => {
  await setupDirectories();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await parseNewsFromOnePage(page, "https://www.gsmarena.com/news.php3");
  await browser.close();


  globalSeed()
  .catch((e) => {
    console.error(e);
    dataBase.$disconnect();
  })
  .finally(() => {
    dataBase.$disconnect();
  });
})();
