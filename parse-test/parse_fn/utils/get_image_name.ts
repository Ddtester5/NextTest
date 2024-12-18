import cuid from "cuid";

export const getImageName = (text?: string | undefined): string => {
  const sanitizedTitle = text
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "_") // Заменяем любые не буквы/цифры на "_"
    .replace(/^_+|_+$/g, "") // Убираем лишние "_" в начале и конце
    .slice(0, 15);

  const uniqueId = cuid();

  return `${sanitizedTitle}_${uniqueId}.jpg`;
};
