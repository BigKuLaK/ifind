const path = require("path");
const glob = require("glob");
const fs = require("fs-extra");

const APP_ROOT = path.resolve(__dirname, "../");

const scssFilePaths = glob.sync(
  path.resolve(APP_ROOT, "src/components/**/*.scss")
);

const nonModulePaths = scssFilePaths.filter(
  (filePath) => !/\.module\.scss$/i.test(filePath)
);

// Convert into *.module.scss
nonModulePaths.forEach((styleSheetPath) => {
  const targetPath = styleSheetPath.replace(/\.scss$/i, ".module.scss");
  fs.renameSync(styleSheetPath, targetPath);
});
