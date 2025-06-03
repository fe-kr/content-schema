import fs from "fs";
import path from "path";
import { compileFromFile } from "json-schema-to-typescript";
import chokidar from "chokidar";

async function convertSchemaToType(file: string) {
  try {
    const data = await compileFromFile(file);
    const target = path.join(
      path.dirname(file),
      path.basename(file, ".json") + ".d.ts"
    );

    console.log(`Schema convertion is started: ${file}`);
    fs.writeFileSync(target, data);
    console.log(`Converted: ${file}`);
  } catch (error) {
    console.error(`Convertion Error for ${file}:`, error);
  }
}

function watchSchemas(relativePath: string) {
  const directory = path.join(process.cwd(), relativePath);

  console.log(`Schema convertion is watched for ${directory}`);

  const watcher = chokidar.watch(path.join(directory, "*.json"), {
    ignored: /^\./,
    persistent: true,
    ignoreInitial: false,
  });

  watcher
    .on("all", (event, path) => {
      console.log(event, path);
    })
    .on("add", async (file) => {
      console.log(`New File: ${file}`);
      await convertSchemaToType(file);
    })
    .on("change", async (file) => {
      console.log(`File is changed: ${file}`);
      await convertSchemaToType(file);
    });
}

const relativePath: string = process.argv[2];

watchSchemas(relativePath);
