import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export async function main() {
  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: "user", content: "Say this is a test" }],
    model: "gpt-4o",
  });
  console.log(chatCompletion);
}
