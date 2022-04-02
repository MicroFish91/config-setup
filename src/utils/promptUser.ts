import os from "os";
import path from "path";

export async function promptUser(): Promise<boolean> {
  console.log(
    `It appears you have a file or directory at ${path.join(
      os.homedir(),
      "mfConfig"
    )}`
  );
  console.log("MicroFish needs to store configuration in this location.");
  console.log(
    `It is possible that you already have a MicroFish configuration stored there, in which case, you probably do not want to overwrite it.`
  );
  console.log(
    "Please note, however, if you do not have a MF configuration installed there MF will not work properly."
  );
  console.log(
    `Would you like to overwrite ${path.join(os.homedir(), "mfConfig")}? (y/N)`
  );

  // Platform dependent line endings
  let r = "\n";
  let n = 1;
  if (os.platform() === "win32") {
    r = "\r\n";
    n = 2;
  }

  return new Promise((resolve, _reject) => {
    // Begin reading from stdin so the process does not exit.
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    // The process object is an instance of EventEmitter.
    // https://www.geeksforgeeks.org/node-js-process-stdin-property/
    process.stdin.on("data", (d: string) => {
      if (
        d.length === n ||
        d.toLowerCase() === `n${r}` ||
        d.toLowerCase() === `no${r}`
      )
        return stopAndReturn(false, resolve);
      if (d.toLowerCase() === `y${r}` || d.toLowerCase() === `yes${r}`)
        return stopAndReturn(true, resolve);
      console.log(
        `${d.slice(0, d.length - n)} is not a valid answer to the question.`
      );
    });

    process.stdin.on("error", () => {
      return stopAndReturn(false, resolve);
    });
  });

  function stopAndReturn(resolveVal: boolean, resolveFn: Function) {
    process.stdin.pause();
    return resolveFn(resolveVal);
  }
}
