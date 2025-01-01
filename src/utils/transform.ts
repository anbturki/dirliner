/**
 * Transform the given file path to a valid file name.
 * @param filePath File path to transform.
 * @returns Transformed file name.
 */
export function transformFileName(filePath: string) {
  const cleanPath = filePath.replace(/^\.\//, "");
  return cleanPath.replace(/\//g, "-");
}
