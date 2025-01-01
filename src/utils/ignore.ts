import fs from "fs";
import micromatch from "micromatch";
import path from "path";

/**
 * Normalize a single ignore pattern to ensure consistent matching
 * @param pattern The pattern to normalize
 * @returns Normalized pattern
 */
function normalizePattern(pattern: string): string {
  let normalized = pattern.trim();

  // Skip empty patterns and comments
  if (!normalized || normalized.startsWith("#")) {
    return "";
  }

  // Handle directory patterns
  if (normalized.endsWith("/")) {
    normalized = `${normalized}**`;
  }

  return normalized;
}

/**
 * Parse ignore patterns from the given array and ignore file and return the combined list of patterns to ignore.
 * @param patterns Array of patterns to ignore in the search process
 * @param ignoreFile File to read ignore patterns from
 * @returns Array of normalized patterns to ignore
 */
export function parseIgnorePatterns(
  patterns: string[] = [],
  ignoreFile: string | null = null
): string[] {
  const result = new Set<string>();

  // Process ignore file patterns first
  if (ignoreFile && fs.existsSync(ignoreFile)) {
    const fileContent = fs.readFileSync(ignoreFile, "utf8");
    const filePatterns = fileContent
      .split("\n")
      .map(normalizePattern)
      .filter(Boolean);

    filePatterns.forEach((pattern) => result.add(pattern));
  }

  // Add command line patterns
  patterns
    .map(normalizePattern)
    .filter(Boolean)
    .forEach((pattern) => result.add(pattern));

  return Array.from(result);
}

/**
 * Create a function that checks if a given item path should be ignored
 * @param patterns Array of patterns to ignore
 * @param sourceDir Source directory to get the relative path from
 * @returns Function that checks if a given item path should be ignored
 */
export function createIgnoreChecker(
  patterns: string[],
  sourceDir: string
): (itemPath: string) => boolean {
  const normalizedPatterns = patterns.filter(Boolean);

  return (itemPath: string): boolean => {
    const relativePath = path.relative(sourceDir, itemPath);
    const matchPath = relativePath.replace(/\\/g, "/");

    // Check if path matches any ignore pattern
    const isMatch = micromatch.isMatch(matchPath, normalizedPatterns, {
      dot: true,
      matchBase: true,
      ignore: ["!**"], // Handle negation patterns properly
      nocase: true, // Case insensitive matching
    });

    // For directories, also check if any parent directory should be ignored
    if (
      !isMatch &&
      fs.existsSync(itemPath) &&
      fs.statSync(itemPath).isDirectory()
    ) {
      const parts = matchPath.split("/");
      let currentPath = "";

      for (const part of parts) {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        if (
          micromatch.isMatch(currentPath, normalizedPatterns, {
            dot: true,
            matchBase: true,
            ignore: ["!**"],
          })
        ) {
          return true;
        }
      }
    }

    return isMatch;
  };
}
