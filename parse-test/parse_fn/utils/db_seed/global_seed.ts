import path from "path";
import fs from "fs";
import { dataBase } from "./db_connect";
import { News, Tag } from "@prisma/client";

type TNews = {
  title: string;
  content: string;
  previewImage: string;
  images: string[];
  tags: string[];
};

export async function globalSeed() {
  // Чтение данных из JSON файла
  const filePath = path.join(
    __dirname,
    "../../../parse_results/init/data/news.json",
  );
  const data: TNews[] = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Для каждой новости добавляем теги и новости
  for (const news of data) {
    const { title, content, previewImage, images, tags } = news;

    // Сначала добавляем или находим теги
    const tagPromises = tags.map((tag): Promise<Tag> => {
      return dataBase.tag.upsert({
        where: { title: tag },
        update: {}, // Если тег существует, ничего не изменяем
        create: { title: tag }, // Если нет, создаем новый
      });
    });

    // Ждем завершения добавления всех тегов
    const createdTags = await Promise.all(tagPromises);

    // Добавляем новость в базу
    const createdNews: News = await dataBase.news.upsert({
      where: { title },
      update: {},
      create: {
        title,
        content: content,
        previewImage: previewImage,
        images: images,
        tags: {
          connect: createdTags.map((tag) => ({ id: tag.id })), // Соединяем новость с тегами
        },
      },
    });

    console.log(`Created news with title: ${createdNews.title}`);
  }
}

// Вызов функции для добавления данных
// globalSeed()
//   .catch((e) => {
//     console.error(e);
//     dataBase.$disconnect();
//   })
//   .finally(() => {
//     dataBase.$disconnect();
//   });
