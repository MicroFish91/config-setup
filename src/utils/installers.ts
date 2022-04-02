import spawn from "cross-spawn";
import os from "os";
import path from "path";

export function installNpmModules(): Promise<void> {
  return new Promise((resolve, _reject) => {
    const installer = spawn("npm", ["install"], {
      cwd: path.join(os.homedir(), "mfConfig"),
    });
    installer.on("exit", resolve);
  });
}
