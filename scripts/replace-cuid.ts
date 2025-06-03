import fs from "fs";
import path from "path";
import chokidar from "chokidar";
import { createId } from "@paralleldrive/cuid2";

function replaceCuidInFile(file: string) {
  try {
    let content = fs.readFileSync(file, "utf8");
    const updatedContent = content.replace(/{cuid}/g, () => createId());

    if (content !== updatedContent) {
      fs.writeFileSync(file, updatedContent, "utf8");
      console.log(`Updated: ${file}`);
    }
  } catch (error) {
    console.error(`Replacement error ${file}:`, error);
  }
}

function watchYAMLFiles(relativePath: string) {
  const directory = path.join(process.cwd(), relativePath);
  const watcher = chokidar.watch(path.join(directory, "**/*.yaml"), {
    ignored: /^\./,
    persistent: true,
    ignoreInitial: false,
  });

  watcher.on("add", (file) => {
    console.log(`New file: ${file}`);
    replaceCuidInFile(file);
  });

  watcher.on("change", (file) => {
    console.log(`File is updated: ${file}`);
    replaceCuidInFile(file);
  });
}

const relativePath: string = process.argv[2]; 
watchYAMLFiles(relativePath);