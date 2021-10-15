const path = require("path");
const { copyFileSync } = require("fs-extra");

const FE_ROOT = path.resolve(__dirname, "../");
const ADMIN_ROOT = path.resolve(FE_ROOT, "../admin");

const ADMIN_TYPES_FILE_PATH = path.resolve(
  ADMIN_ROOT,
  "typings",
  "admin.graphql.d.ts"
);
const FE_TYPES_FILE_PATH = path.resolve(
  FE_ROOT,
  "typings",
  "admin.graphql.d.ts"
);

copyFileSync(ADMIN_TYPES_FILE_PATH, FE_TYPES_FILE_PATH);
