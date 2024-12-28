import fs from "fs";
import path from "path";
export const addMyWatermarkAndDeleteEnemies = async (
  filePath: string,
): Promise<string> => {
  console.log(`Файл ${filePath} существует? : ${fs.existsSync(filePath)}`);
  const imageBuffer = fs.readFileSync(filePath);
  console.log(imageBuffer);

  return filePath;
};

addMyWatermarkAndDeleteEnemies(
  "/workspaces/NextTest/parse-test/parse_fn/utils/test.jpg",
);
