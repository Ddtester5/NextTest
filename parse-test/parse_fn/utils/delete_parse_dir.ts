import { rm } from "fs/promises";
import { ROOT_PARSE_DIR } from "./const";

export const deleteParseDirs = async () => {
  try {
    await rm(ROOT_PARSE_DIR, {
      recursive: true,
    });
  } catch (error) {
    console.warn("Failed to delete parse_results dir: ", error);
  }
};

