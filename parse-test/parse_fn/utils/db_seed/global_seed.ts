import { AllNewsSeed } from "./all_news_seed";
import { AllReviewsSeed } from "./all_reviews_seed";

export async function globalSeed() {
  await AllNewsSeed();
  await AllReviewsSeed();
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
