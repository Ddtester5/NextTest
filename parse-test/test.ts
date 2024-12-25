import { chromium } from "playwright";
import { parseNewsFromOnePage } from "./parse_fn/get_news_with_tag_from_one_page";
import { setupDirectories } from "./parse_fn/utils/setup_dirs";
import { globalSeed } from "./parse_fn/utils/db_seed/global_seed";
import { dataBase } from "./parse_fn/utils/db_seed/db_connect";
import { parseNewsFromManyPages } from "./parse_fn/get_news_with_tag_from_many_pages";
import { parseReviewsFromOnePage } from "./parse_fn/get_reviews_with_tag_from_one_page";
// import { deleteParseDirs } from "./parse_fn/utils/delete_parse_dir";

(async () => {
  await setupDirectories();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await parseNewsFromManyPages(page, 3);
  await parseReviewsFromOnePage(page);
  await browser.close();

  globalSeed()
    .catch((e) => {
      console.error(e);
      dataBase.$disconnect();
    })
    .finally(() => {
      dataBase.$disconnect();
    });

  // deleteParseDirs();
})();
