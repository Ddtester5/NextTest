import { client } from "./ai_client";

export const GenerateMetaTitle = async (title: string): Promise<string> => {
  let chatCompletion = await client.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Ты профессиональный CEO специалист, занимаешься продвижением сайтов в топ поиска google. 
            Сделай мета заголок длиной 50 символов  для статьи на основе существующего .
    На выходе должен получиться заголовок на руском  для статьи блога максимальной длинной 50 символов.
            При ответе не добавляй комментарии, пояснения, символы(\`'"/|\<>) . Исходный заголовок: "${title}"`,
      },
    ],
    model: "gpt-4",
  });

  return chatCompletion.choices[0].message.content
    ? chatCompletion.choices[0].message.content
    : "";
};

export const GenerateMetaDescription = async (
  text: string,
): Promise<string> => {
  const chatCompletion = await client.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Ты профессиональный CEO специалист, занимаешься продвижением сайтов в топ поиска google. 
              Сделай мета описание длиной 140 символов для статьи на основе существующего текста.
      На выходе должено получиться описание на руском  для статьи блога максимальной длинной 140 символов.
              При ответе не добавляй комментарии, пояснения, символы(\`'"/|\<>) . Исходный текст: "${text}"`,
      },
    ],
    model: "gpt-4",
  });
  return chatCompletion.choices[0].message.content
    ? chatCompletion.choices[0].message.content
    : "";
};
