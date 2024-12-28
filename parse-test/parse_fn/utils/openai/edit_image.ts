import axios from "axios";
import { client } from "./ai_client";
import fs from "fs";
import path from "path";
import { IMG_DIR } from "../const";

// Функция для преобразования изображения в File
const createFileFromBuffer = (imagePath: string): File => {
  const imageBuffer = fs.readFileSync(imagePath); // Читаем изображение как Buffer
  const file = new File([imageBuffer], path.basename(imagePath), {
    type: "image/jpg", // Укажите нужный тип (например, 'image/png')
  });
  return file;
};

// Функция для редактирования изображения с помощью AI
export const EditImage = async (imagePath: string) => {
  //   try {
  // Преобразуем изображение в File
  console.log(fs.existsSync(imagePath));
  const imageFile = createFileFromBuffer(imagePath);
  // Отправляем изображение на редактирование в AI
  const chatCompletion = await client.images.createVariation({
    model: "flux", // Укажите нужную модель
    // prompt: "White horses  on the field ",
    image: imageFile,
    //   "Убери с изображения все водяные знаки и надписи, остальное оставь как было",
    // image: imageFile, // Передаем изображение в формате File
    response_format: "url", // Получаем URL редактированного изображения
  });

  // Если редактирование прошло успешно, получаем URL редактированного изображения
  console.log(chatCompletion.data[0]);
  //     const editedImageUrl = chatCompletion.data[0].url;

  //     // Теперь скачиваем редактированное изображение
  //     if (editedImageUrl) {
  //       const newImageBuffer = await downloadImage(editedImageUrl);

  //       // Удаляем старое изображение
  //       if (fs.existsSync(imagePath)) {
  //         fs.unlinkSync(imagePath); // Удаляем старое изображение
  //       }

  //       // Сохраняем редактированное изображение по тому же пути
  //       fs.writeFileSync(imagePath, newImageBuffer);
  //     }

  //     // Возвращаем путь к редактированному изображению
  //     return imagePath; // Вернем тот же путь, поскольку файл был перезаписан
  //   } catch (error) {
  //     console.error("Ошибка при редактировании изображения:", error);
  //     throw error;
  //   }
};

// Функция для скачивания изображения по URL
const downloadImage = async (url: string): Promise<Buffer> => {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    },
  });
  const imageBuffer = Buffer.from(response.data); // Преобразуем в буфер
  return imageBuffer;
};

// Пример использования
EditImage("/workspaces/NextTest/parse-test/parse_fn/utils/test.jpg");
