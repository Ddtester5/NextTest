import { dataBase } from "./db_connect";
import { News, Tag } from "@prisma/client";
import { delay } from "./delay";

export async function SeedNews(
  metaTitle: string,
  metaDescription: string,
  date: Date,
  ingTitle: string,
  ruTitle: string,
  content: string,
  previewImage: string,
  images: string[],
  tags: string[],
) {
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
    where: { title: ruTitle },
    update: {},
    create: {
      meta_title: metaTitle,
      meta_description: metaDescription,
      createdAt: date,
      title: ruTitle,
      content: content,
      previewImage: previewImage,
      images: images,
      tags: {
        connect: createdTags.map((tag) => ({ id: tag.id })), // Соединяем новость с тегами
      },
    },
  });

  await dataBase.newsParsedTitles.upsert({
    where: { title: ingTitle },
    update: {},
    create: {
      title: ingTitle,
    },
  });

  console.log(`Created news with title: ${createdNews.title}`);
  await delay(1000);
}
