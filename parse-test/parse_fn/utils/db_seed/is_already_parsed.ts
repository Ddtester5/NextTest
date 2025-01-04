import { dataBase } from "./db_connect";

export const IsNewsAlresdyParsed = async (title: string): Promise<Boolean> => {
  const isTitliExist = await dataBase.newsParsedTitles.findFirst({
    where: {
      title: title,
    },
  });
  if (isTitliExist) {
    return true;
  } else {
    return false;
  }
};

export const IsReviewAlreadyParsed = async (
  title: string,
): Promise<Boolean> => {
  const isTitliExist = await dataBase.reviewsParsedTitles.findFirst({
    where: {
      title: title,
    },
  });
  if (isTitliExist) {
    return true;
  } else {
    return false;
  }
};
