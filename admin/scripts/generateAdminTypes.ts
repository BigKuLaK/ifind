// require("module-alias/register");
import "colors";
import path from "path";
import glob from "glob";
import { readFileSync } from "fs-extra";
import { generateTypeScriptTypes } from "graphql-schema-typescript";

const projectRoot = path.resolve(__dirname, "../");
const outputPath = path.resolve(projectRoot, "typings/admin.graphql.d.ts");

const [schemaFile] = glob.sync(
  path.resolve(projectRoot, "../admin/exports/**/*.graphql")
);

if (!schemaFile) {
  console.log(`Unable to find schema file`.yellow);
  process.exit();
}

(async () => {
  const schemaContents: string = readFileSync(schemaFile).toString();

  const options = {
    global: true,
    typePrefix: "",
  };

  generateTypeScriptTypes(schemaContents, outputPath, options)
    .then(() => {
      console.log("DONE");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
})();
