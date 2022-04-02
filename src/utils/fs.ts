import { Stats } from "fs";
import * as fse from "fs-extra";
import glob from "glob-promise";
import os from "os";
import path from "path";
import rmrf from "rimraf";

// Copy files from cwd/contents into ~/mfConfig
export async function copyFilesOver(): Promise<void> {
  await rmrfProm(path.join(os.homedir(), "mfConfig"));

  const filenames = await glob("./**/*.*", {
    cwd: path.join(__dirname, "..", "contents"),
  });

  for (let i = 0; i < filenames.length; i++) {
    const file = filenames[i];
    const fromLoc = path.join(__dirname, "..", "contents", file);
    const toLoc = path.join(os.homedir(), "mfConfig", file);
    await fse.copy(fromLoc, toLoc);
  }
}

// Equivalent to: "rm -rf $path"
export function rmrfProm(path: string): Promise<void> {
  return new Promise((res, rej) => {
    rmrf(path, (err) => {
      if (err) return rej(err);
      return res();
    });
  });
}

// Returns an fse.stats object
export function statProm(path: string): Promise<Stats> {
  return new Promise((res, rej) => {
    fse.stat(path, (err: Error, stats: Stats) => {
      if (err) return rej(err);
      return res(stats);
    });
  });
}
