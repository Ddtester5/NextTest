const playwright = require("playwright");


(async () => {
  const browser = await playwright.chromium.launch({

    headless: true,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('start')

  await page.goto("https://www.gsmarena.com/makers.php3");
  const table =await page.locator('td').allInnerTexts()
  const brands = table.map((el)=>{return el.split('\n')[0]})
  console.log(brands)



  console.log('end')
  await browser.close();
})();