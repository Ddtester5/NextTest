export const generateDataForPost = (input: string ) => {
  const newDate = new Date(input);

  // Генерируем случайное время
  const randomHours = Math.floor(Math.random() * 24); // 0–23
  const randomMinutes = Math.floor(Math.random() * 60); // 0–59
  const randomSeconds = Math.floor(Math.random() * 60); // 0–59

  // Устанавливаем случайное время
  newDate.setHours(randomHours, randomMinutes, randomSeconds);

  return newDate;
};
