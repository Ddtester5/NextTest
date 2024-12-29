import sharp from "sharp";
import fs from "fs";

export const replaceWatermarkWithSharp = async (
  imagePath: string,
  replacementText: string,
) => {
  try {
    // Получаем метаданные изображения
    const { width, height } = await sharp(imagePath).metadata();

    if (!width || !height) {
      throw new Error("Не удалось получить размеры изображения.");
    }

    // Задаем относительные пропорции для области водяного знака
    const xRatio = 0.69;
    const yRatio = 0.84;
    const widthRatio = 0.3;
    const heightRatio = 0.15;

    // Вычисляем абсолютные координаты и размеры области
    const x = Math.round(width * xRatio);
    const y = Math.round(height * yRatio);
    const regionWidth = Math.round(width * widthRatio);
    const regionHeight = Math.round(height * heightRatio);
    const fontSize = Math.round(regionHeight * 0.34);

    // Извлекаем, размываем и вставляем область обратно
    const blurredRegion = await sharp(imagePath)
      .extract({ left: x, top: y, width: regionWidth, height: regionHeight })
      .blur(5)
      .toBuffer();

    const blurredImage = await sharp(imagePath)
      .composite([
        {
          input: blurredRegion,
          top: y,
          left: x,
        },
      ])
      .toBuffer();

    // Добавляем текст с градиентом и тенью
    const finalImage = await sharp(blurredImage)
      .composite([
        {
          input: Buffer.from(`
            <svg width="${regionWidth}" height="${regionHeight}" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="textShadow" x="0" y="0" width="200%" height="200%">
                  <feDropShadow dx="3" dy="3" stdDeviation="3" flood-color="rgba(41, 2, 31, 0.7)" />
                </filter>
                <radialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="40%" style="stop-color:rgb(160, 22, 137);stop-opacity:0.65" />
                  <stop offset="80%" style="stop-color:rgb(160, 22, 137);stop-opacity:0.3" />
                  <stop offset="100%" style="stop-color:rgb(160, 22, 137);stop-opacity:0" />
                </radialGradient>
              </defs>
              <rect x="0" y="0" width="${regionWidth}" height="${regionHeight}" fill="url(#grad)" />
              <text 
                x="${regionWidth / 2}" 
                y="${regionHeight / 1.5}" 
                font-size="${fontSize}" 
                fill="rgba(255, 255, 255, 0.9)" 
                font-weight="700" 
                font-style="italic" 
                text-anchor="middle" 
                dominant-baseline="middle" 
                letter-spacing="1px" 
                font-family="Arial"
                filter="url(#textShadow)"
              >
                ${replacementText.toLocaleUpperCase()}
              </text>
            </svg>
          `),
          top: y,
          left: x,
        },
      ])
      .sharpen()
      .modulate({
        brightness: 1.05, // Увеличение яркости
        saturation: 1.05, // Увеличение насыщенности
      })
      .normalize()
      .toBuffer();

    // Перезаписываем исходный файл
    fs.writeFileSync(imagePath, finalImage);
  } catch (error) {
    console.error("Ошибка при обработке изображения:", error);
  }
};

// Пример использования
(async () => {
  const imagePath = "/workspaces/NextTest/parse-test/parse_fn/utils/test.jpg";
  const replacementText = "tech24view.ru";

  await replaceWatermarkWithSharp(imagePath, replacementText);
})();
