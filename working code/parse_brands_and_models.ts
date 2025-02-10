import {Page} from "@playwright/test";

export const parseModelsByBrand = async(brandUrl:string,page:Page)=>{
  const allModelsUrl =[]
  let currentPage:string|null = `https://www.gsmarena.com/${brandUrl}`;
  while(currentPage){
page.goto(currentPage,{waitUnyil:"domcontentloaded"})
  
  //add locator
  const allModelsSinlePage = await page.locator("").evaluateAll(
    (el)=>({
      return el.map(
      (e)=>({
        modelUrl:e.querySelector("a").getAttribute("href")
      })
      ).filter(
(e)=>e.modelUrl!== null && e.modelUrl !== undefined
      )
    })
  )
  allModelsUrl= allModelsUrl.concat(allModelsSinlePage)

        // Проверка на наличие кнопки "Next page"
        const nextPageElement = await page.locator(".pages-next").nth(0);
        const isDisabled = await nextPageElement.evaluate(
          (el) =>
            el.classList.contains("disabled") ||
            el.getAttribute("href") === "#",
        );

        if (isDisabled) {
          currentPage = null; // Завершаем цикл
        } else {
          currentPage = await nextPageElement.getAttribute("href");
          if (currentUrl) {
            currentUrl = `https://www.gsmarena.com/${currentUrl}`;
          }
        }
  }
  }
  return allModelsUrl
}
