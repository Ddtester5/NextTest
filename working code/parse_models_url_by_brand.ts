import { Page } from "@playwright/test";

export const parseModelsUrlByBrand = async (brandUrl: string, page: Page):string[] => {
  const allModelsUrl: string[] = [];
  let currentPage: string | null = `https://www.gsmarena.com/${brandUrl}`;

  while (currentPage) {
    // Переход на текущую страницу
    await page.goto(currentPage, { waitUntil: "domcontentloaded" });

    // Локатор для всех моделей на странице
    const allModelsSinglePage = await page
      .locator(".makers .main-review a")
      .evaluateAll((elements) =>
        elements
          .map((e) => e.getAttribute("href"))
          .filter((href) => href !== null && href !== undefined),
      );

    // Добавляем URL моделей в общий массив
    allModelsUrl.push(...allModelsSinglePage);

    // Проверка на наличие кнопки "Next page"
    const nextPageElement = page.locator(".pages-next").first();
    const isDisabled = await nextPageElement.evaluate(
      (el) =>
        el.classList.contains("disabled") || el.getAttribute("href") === "#",
    );

    if (isDisabled) {
      currentPage = null; // Завершаем цикл
    } else {
      currentPage = await nextPageElement.getAttribute("href");
      if (currentPage) {
        currentPage = `https://www.gsmarena.com/${currentPage}`;
      }
    }
  }

  return allModelsUrl.reverse();
};
