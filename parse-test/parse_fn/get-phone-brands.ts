import playwright from "playwright";

interface PhoneBrandsAndLink {
  brands: string[];
  brandsAndLinks: string[][];
}

export const getPhoneBrandsAndLink = async (
  page: playwright.Page,
): Promise<PhoneBrandsAndLink | []> => {
  try {
    await page.goto("https://www.gsmarena.com/makers.php3", {
      waitUntil: "domcontentloaded",
    });
    const brandsLocator = page.locator("td a ").count();
    if ((await brandsLocator) === 0) {
      console.warn(
        "No brands found. The structure of the page might have changed.",
      );
      return [];
    }
    const tableText = await page.locator("td  a").allInnerTexts();
    const brandDeviseLinks = await page
      .locator("td  a")
      .evaluateAll((e) =>
        e.map((a) => a.getAttribute("href")).filter((href) => href !== null),
      );
    const brands = tableText.map((el: string) => el.split("\n")[0]);
    const brandsAndLinks = brandDeviseLinks.map((e, i) => {
      return [brands[i], e];
    });

    return { brands, brandsAndLinks };
  } catch (error) {
    console.error("Error fetching phone brands:", error);
    return [];
  }
};
