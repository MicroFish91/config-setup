import os from "os";
import path from "path";
import {
  copyFilesOver,
  installNpmModules,
  promptUser,
  statProm,
} from "./utils";

install()
  .then(() => console.log(console.log("MicroFish has finished installing.")))
  .catch((err) => console.log(err));

async function install(): Promise<void> {
  let promptForOverwrite = false;
  let overwrite = false;

  try {
    // Checks if mfConfig exists as a file or dir
    const mfStats = await statProm(path.join(os.homedir(), "mfConfig"));
    if (mfStats.isDirectory() || mfStats.isFile()) promptForOverwrite = true;
  } catch (err) {
    // ENOENT => Error NO ENTry (or Error NO ENTity)
    // No such file or directory
    if (err.code !== "ENOENT") throw err;
    overwrite = true;
  }

  // If file exists, should we overwrite?
  if (promptForOverwrite) overwrite = await promptUser();

  // If mfConfig doesn't exist or if user prompts for an overwrite...
  if (overwrite) {
    console.log("Installing configurations");
    await copyFilesOver();
    console.log("Installing dependencies");
    return installNpmModules();
  }
  return Promise.resolve();
}
