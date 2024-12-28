import { client } from "./ai_client";

export const translateAndUnicTitle = async (
  text: string,
): Promise<string | null> => {
  const chatCompletion = await client.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Ты профессиональный переводчик и редактор. Переведи данный текст на русский язык, сохраняя смысл, но изменяя стиль на более креативный и выразительный. Добавь литературности, богатства языка и эмоциональности. 
        Не  изменяй и не переводи слова, если они относится к следующим категориям:
- название марки (например, "samsung", "apple"),
- модель устройства (например, "iphone 15", "galaxy s22"),
- операционная система (например, "android", "ios"),
Перевод не должен быть дословным, на выходе должен получиться заголовок для статьи блога . Максимальная длянна 15 слов.
        Не добавляй комментарии, пояснения, символы(\`'"/|\<>) . Текст: "${text}"`,
      },
    ],
    model: "gpt-4o",
  });
  return chatCompletion.choices[0].message.content;
};
