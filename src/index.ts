import fs from "fs";
import path from "path";
import { blue, green, yellow, red, gray, bold } from "colorette";

import { createIgnoreChecker, parseIgnorePatterns } from "./utils/ignore";
import { transformFileName } from "./utils/transform";
import { formatSize } from "./utils/format";

export interface DirLinerOptions {
  source?: string;
  target?: string;
  ignorePatterns?: string[];
  ignoreFile?: string | null;
  verbose?: boolean;
}

export interface ProcessedFile {
  source: string;
  target: string;
}

export interface DirLinerResult {
  success: boolean;
  processed: ProcessedFile[];
  error: string | null;
  stats: {
    filesProcessed: number;
    directoriesProcessed: number;
    filesIgnored: number;
    directoriesIgnored: number;
    totalSize: number;
  };
}

export class DirLiner {
  private options: Required<DirLinerOptions>;
  private patterns: string[];
  private shouldIgnore: (filePath: string) => boolean;
  private stats = {
    filesProcessed: 0,
    directoriesProcessed: 0,
    filesIgnored: 0,
    directoriesIgnored: 0,
    totalSize: 0,
  };

  constructor(options: DirLinerOptions = {}) {
    this.options = {
      source: options.source || "./",
      target: options.target || "./output",
      ignorePatterns: options.ignorePatterns || [],
      ignoreFile: options.ignoreFile || ".dirlinerignore",
      verbose: options.verbose || false,
    };
    this.patterns = parseIgnorePatterns(
      this.options.ignorePatterns,
      this.options.ignoreFile
    );
    this.shouldIgnore = createIgnoreChecker(this.patterns, this.options.source);
  }

  private log(
    type: "info" | "success" | "warning" | "error",
    message: string
  ): void {
    if (!this.options.verbose) return;

    const timestamp = new Date().toISOString().split("T")[1].slice(0, -1);
    const prefix = gray(`[${timestamp}]`);

    switch (type) {
      case "info":
        console.log(`${prefix} ℹ ${message}`);
        break;
      case "success":
        console.log(`${prefix} ✓ ${message}`);
        break;
      case "warning":
        console.log(`${prefix} ⚠ ${message}`);
        break;
      case "error":
        console.log(`${prefix} ✖ ${message}`);
        break;
    }
  }

  private logStats(): void {
    if (!this.options.verbose) return;

    console.log("\n" + bold("📊 Processing Statistics:"));
    console.log(blue("├─ Files Processed:"), this.stats.filesProcessed);
    console.log(
      blue("├─ Directories Processed:"),
      this.stats.directoriesProcessed
    );
    console.log(yellow("├─ Files Ignored:"), this.stats.filesIgnored);
    console.log(
      yellow("├─ Directories Ignored:"),
      this.stats.directoriesIgnored
    );
    console.log(
      green("└─ Total Size Processed:"),
      formatSize(this.stats.totalSize)
    );
  }

  private processDirectory(currentPath: string): ProcessedFile[] {
    if (this.shouldIgnore(currentPath)) {
      this.log("warning", `Ignoring directory: ${yellow(currentPath)}`);
      this.stats.directoriesIgnored++;
      return [];
    }

    const processed: ProcessedFile[] = [];
    this.stats.directoriesProcessed++;

    this.log("info", `Processing directory: ${blue(currentPath)}`);
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const fullPath = path.join(currentPath, item);

      if (this.shouldIgnore(fullPath)) {
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          this.stats.directoriesIgnored++;
          this.log("warning", `Ignoring directory: ${yellow(fullPath)}`);
        } else {
          this.stats.filesIgnored++;
          this.log("warning", `Ignoring file: ${yellow(fullPath)}`);
        }
        continue;
      }

      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        const nested = this.processDirectory(fullPath);
        processed.push(...nested);
      } else {
        const relativePath = path.relative(this.options.source, fullPath);
        const newFileName = transformFileName(relativePath);
        const targetPath = path.join(this.options.target, newFileName);

        if (!fs.existsSync(path.dirname(targetPath))) {
          fs.mkdirSync(path.dirname(targetPath), { recursive: true });
          this.log(
            "info",
            `Created directory: ${blue(path.dirname(targetPath))}`
          );
        }

        fs.copyFileSync(fullPath, targetPath);
        this.stats.filesProcessed++;
        this.stats.totalSize += stats.size;

        this.log(
          "success",
          `Copied ${green(fullPath)} → ${green(targetPath)} (${formatSize(
            stats.size
          )})`
        );
        processed.push({ source: fullPath, target: targetPath });
      }
    }
    return processed;
  }

  public execute(): DirLinerResult {
    try {
      this.log("info", bold("🚀 Starting DirLiner"));
      this.log("info", "\nConfiguration:");
      this.log("info", `├─ Source: ${blue(this.options.source)}`);
      this.log("info", `├─ Target: ${blue(this.options.target)}`);
      this.log(
        "info",
        `├─ Ignore patterns: ${yellow(this.patterns.join(", ") || "none")}`
      );
      this.log(
        "info",
        `├─ Ignore file: ${yellow(this.options.ignoreFile || "none")}`
      );
      this.log("info", `└─ Verbose: ${blue(String(this.options.verbose))}\n`);

      const results = this.processDirectory(this.options.source);

      this.logStats();

      this.log("success", bold("\n✨ Processing completed successfully!\n"));

      return {
        success: true,
        processed: results,
        error: null,
        stats: this.stats,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.log("error", red(`\n💥 Error: ${errorMessage}\n`));

      return {
        success: false,
        processed: [],
        error: errorMessage,
        stats: this.stats,
      };
    }
  }
}
