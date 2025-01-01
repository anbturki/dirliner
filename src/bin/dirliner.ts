#!/usr/bin/env node
import { Command } from "commander";
import { DirLiner } from "..";
import { blue, green, yellow, red, bold, cyan, magenta } from "colorette";
import { formatSize } from "../utils/format";

const program = new Command();

// Show banner
console.log(
  cyan(`
╔═══════════════════════════════════════╗
║             ${bold("DirLiner")}                  ║
║  Transform directories into flat files ║
╚═══════════════════════════════════════╝
`)
);

program
  .version("1.0.0", "-V, --version", "Output the current version")
  .name("dirliner")
  .description("Transform directory structures into flat files")
  .option("-s, --source <dir>", "Source directory", "./")
  .option("-t, --target <dir>", "Target directory", "./output")
  .option("-v, --verbose", "Show verbose output", false)
  .option("-i, --ignore <patterns>", "Ignore patterns (comma-separated)", "")
  .option(
    "--ignore-file <file>",
    "File containing ignore patterns",
    ".dirlinerignore"
  )
  .addHelpText(
    "after",
    `
Examples:
  $ dirliner -s ./src -t ./dist            # Basic usage
  $ dirliner -s ./src -v                   # Verbose output
  $ dirliner -i "node_modules,*.log"       # Ignore patterns
  $ dirliner --ignore-file .customignore   # Custom ignore file
  `
  )
  .parse(process.argv);

const options = program.opts();

// Convert comma-separated ignore patterns to array
const ignorePatterns = options.ignore
  ? options.ignore
      .split(",")
      .map((p: string) => p.trim())
      .filter(Boolean)
  : [];

// Show initial configuration
if (options.verbose) {
  console.log(bold("\n📋 Configuration:"));
  console.log(blue("├─ Source:"), options.source);
  console.log(blue("├─ Target:"), options.target);
  console.log(
    blue("├─ Ignore Patterns:"),
    yellow(ignorePatterns.length ? ignorePatterns.join(", ") : "none")
  );
  console.log(blue("└─ Ignore File:"), yellow(options.ignoreFile || "none"));
  console.log();
}

// Show progress spinner
const startTime = Date.now();
process.stdout.write(cyan("🔄 Processing... "));

const dirLiner = new DirLiner({
  source: options.source,
  target: options.target,
  verbose: options.verbose,
  ignorePatterns,
  ignoreFile: options.ignoreFile,
});

const result = dirLiner.execute();

// Clear the spinner line
process.stdout.clearLine(0);
process.stdout.cursorTo(0);

if (!result.success) {
  console.error(red(`\n💥 Error: ${result.error}\n`));
  process.exit(1);
}

// Calculate execution time
const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);

// Show summary even in non-verbose mode
console.log(bold("\n📊 Summary:"));
console.log(blue("├─ Files Processed:"), result.stats.filesProcessed);
console.log(
  blue("├─ Directories Processed:"),
  result.stats.directoriesProcessed
);
console.log(yellow("├─ Files Ignored:"), result.stats.filesIgnored);
console.log(yellow("├─ Directories Ignored:"), result.stats.directoriesIgnored);
console.log(green("├─ Total Size:"), formatSize(result.stats.totalSize));
console.log(magenta("└─ Execution Time:"), `${executionTime}s`);

// Show success message
console.log(green("\n✨ Processing completed successfully!\n"));
