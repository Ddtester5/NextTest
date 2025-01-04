import { client } from "./ai_client";

export const translateTags = async (tags: string[]): Promise<string | null> => {
  const chatCompletion = await client.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Ты профессиональный переводчик и редактор статей. Переведи данные тэги на русский язык, используя только строчные буквы. Не изменяй тэг, если он относится к следующим категориям:
- название марки (например, "samsung", "apple","oppo","nothing","lava","tecno"),
- модель устройства (например, "iphone 15", "galaxy s22"),
- операционная система (например, "android", "ios"),
а обычные слова/существительные переводи(например, "слухи", "анонс","обновление ПО").

Ответь строго массивом с результатами в формате: ["tag1", "tag2", ...].Если тэгов нет, то пустой массив. Не добавляй комментарии, пояснения, символы(\`'"/|\<>) или текст вне массива. Вот список тэгов: ${JSON.stringify(tags)}`,
      },
    ],
    model: "gpt-4",
  });

  return chatCompletion.choices[0].message.content
    ? chatCompletion.choices[0].message.content
    : "";
};
