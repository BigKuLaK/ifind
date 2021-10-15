const glob = require("glob");
const { existsSync, readFileSync } = require("fs-extra");
const path = require("path");

const backgroundProcessesRoot = path.resolve(
  __dirname,
  "../../../../background-process"
);
module.exports = (backgroundProcessName) => {
  const backgroundProcessFolder = path.resolve(
    backgroundProcessesRoot,
    backgroundProcessName
  );

  if (!existsSync(backgroundProcessFolder)) {
    return null;
  }

  // Get background process title
  const backgroundProcessInstance = require(backgroundProcessFolder);

  // Get current status through the switch file
  const [switchFilePath] = glob.sync(
    path.resolve(backgroundProcessFolder, ".switch")
  );
  const status = switchFilePath
    ? readFileSync(switchFilePath).toString().trim()
    : "stopped";

  const logFilesPaths = glob.sync(
    path.resolve(backgroundProcessFolder, "logs/*.log")
  );

  // Get only recent 100 logs
  const logs = [];

  // Get log entries from recent to oldest
  logFilesPaths.reverse().some((logFilePath) => {
    const logFileContents = readFileSync(logFilePath).toString();
    const logEntries = logFileContents.split("\n");
    const logsCountToGet = 100 - logs.length;

    logEntries
      .reverse()
      .slice(0, logsCountToGet)
      .some((logEntry) => {
        const [date_time = "", type = "", message = ""] = logEntry.split(" | ");

        if (message || type || message) {
          // Remove ANSI formatting on some properties
          logs.push({
            date_time: date_time.replace(/\u001b\[\d+m/gi, "").trim(),
            type: type.replace(/\u001b\[\d+m/gi, "").trim() || "INFO",
            message,
          });
        }
      });

    // Break loop if there's already 100 log entries
    if (logs.length >= 100) {
      return true;
    }
  });

  return {
    name: backgroundProcessInstance.name,
    status,
    logs: logs.reverse(),
  };
};
