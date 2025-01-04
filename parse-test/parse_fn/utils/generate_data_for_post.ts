export const generateDataForPost = (input: string) => {
  let newDate = new Date(input);

  if (new Date().getTime() < newDate.getTime() + 24 * 60 * 60 * 1000) {
    newDate = new Date(); // Переприсваиваем на текущую дату
  } else {
    // Генерируем случайное время
    const randomHours = Math.floor(Math.random() * 24); // 0–23
    const randomMinutes = Math.floor(Math.random() * 60); // 0–59
    const randomSeconds = Math.floor(Math.random() * 60); // 0–59

    // Устанавливаем случайное время
    newDate.setHours(randomHours, randomMinutes, randomSeconds);
  }

  return newDate;
};
