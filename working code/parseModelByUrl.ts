import {Page} from "@playwright/test"
export const parseModelByUrl=async(modelUrl:string,page:Page)/>{
await page.goto(`https://www.gsmarena.com/${modelUrl},{waitUnyil:"domcontentloaded"})
}
