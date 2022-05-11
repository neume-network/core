// @format
import { access, mkdir } from "fs/promises";
import { constants } from "fs";

export async function provisionDir(path) {
  try {
    await access(path, constants.R_OK);
  } catch (err) {
    await mkdir(path);
  }
}
