import path from "path";
import fs from "fs";
import { dataBase } from "./db_connect";
import { Reviews, Tag } from "@prisma/client";
import { delay } from "./delay";

type TReviews = {
  title: string;
  content: string;
  previewImage: string;
  images: string[];
  tags: string[];
};
export async function AllReviewsSeed() {
  // Чтение данных из JSON файла
  const filePath = path.join(
    __dirname,
    "../../../parse_results/init/data/news.json",
  );
  const data: TReviews[] = JSON.parse(fs.readFileSync(filePath, "utf8"));

  for (const reviews of data) {
    const { title, content, previewImage, images, tags } = reviews;

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

    // Добавляем обзор в базу
    const createdReviews: Reviews = await dataBase.reviews.upsert({
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

    console.log(`Created news with title: ${createdReviews.title}`);
    await delay(1000);
  }
}
