// @format
import test from "ava";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { rmdir, access } from "fs/promises";
import { constants } from "fs";

import { provisionDir } from "../src/disc.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("provisioning an existing directory", async (t) => {
  const testDir = "fixtures";
  const existentDir = resolve(__dirname, testDir, "existent");
  await provisionDir(existentDir);
  t.pass();
});

// TODO: Why do we get a EPERM error on unlinking the directory in the end?
test("provisioning a non-existent directory", async (t) => {
  const testDir = "fixtures";
  const nonExistentDir = resolve(__dirname, testDir, "nonexistent");
  await provisionDir(nonExistentDir);

  try {
    await rmdir(nonExistentDir);
  } catch (err) {
    console.error(err);
    t.fail();
  }
  t.pass();
});
