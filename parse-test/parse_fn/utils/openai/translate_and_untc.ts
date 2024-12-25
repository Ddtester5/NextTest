import { client } from "./ai_client";

export const translateAndUnicText = async () => {
  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: "user", content: "Say this is a test" }],
    model: "gpt-4o",
  });
  console.log(chatCompletion);
};

translateAndUnicText();
