import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function seed() {
  // Создание пользователей
  await prisma.user.createMany({
    data: Array.from({ length: 50 }, () => ({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      image: faker.image.avatar(),
    })),
    skipDuplicates: true,
  });

  console.log("50 пользователей созданы.");

  // Создание категорий
  await prisma.category.createMany({
    data: Array.from({ length: 20 }, () => ({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
    })),
    skipDuplicates: true,
  });

  console.log("20 категорий созданы.");

  // Получение всех категорий
  const allCategories = await prisma.category.findMany();

  // Создание постов
  await prisma.post.createMany({
    data: Array.from({ length: 200 }, () => ({
      title: faker.lorem.words({ min: 2, max: 6 }),
      content: faker.lorem.paragraphs(3),
      published: faker.datatype.boolean(),
      previewImage: faker.image.url(),
      images: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
        faker.image.url(),
      ),
      categoryId:
        allCategories[Math.floor(Math.random() * allCategories.length)].id,
    })),
    skipDuplicates: true,
  });

  console.log("200 постов созданы.");

  // Получение всех постов
  const allPosts = await prisma.post.findMany();
  const allUsers = await prisma.user.findMany();

  // Создание лайков
  await prisma.like.createMany({
    data: Array.from({ length: 500 }, () => ({
      postId: allPosts[Math.floor(Math.random() * allPosts.length)].id,
      userId: allUsers[Math.floor(Math.random() * allUsers.length)].id,
    })),
    skipDuplicates: true,
  });

  console.log("500 лайков созданы.");

  // Создание закладок
  await prisma.bookmark.createMany({
    data: Array.from({ length: 300 }, () => ({
      postId: allPosts[Math.floor(Math.random() * allPosts.length)].id,
      userId: allUsers[Math.floor(Math.random() * allUsers.length)].id,
    })),
    skipDuplicates: true,
  });

  console.log("300 закладок созданы.");
}

seed()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Сидирование завершено.");
  })
  .catch(async (e) => {
    console.error("Ошибка во время сидирования:", e);
    await prisma.$disconnect();
    process.exit(1);
  });