const path = require("path");

module.exports = async (backgroundProcessName, status) => {
  const backgroundProcessFolder = getBackgroundProcessPath(
    backgroundProcessName
  );

  if (!backgroundProcessFolder) {
    return null;
  }

  // Get the switch module
  const backgroundProcessModule = require(path.resolve(backgroundProcessFolder));

  // Throw error if no swtich module is found for the background process
  if ( !backgroundProcessModule ) {
    throw new Error(`No module found for background process: ${backgroundProcessName}`);
  }

  // Trigger process
  switch (status) {
    case 'START':
      backgroundProcessModule.switch.start();
      break;
    case 'STOP':
      backgroundProcessModule.switch.stop();
      break;
  }

  // Get current process stats
  return await this.getBackgroundProcess(backgroundProcessName);
}
