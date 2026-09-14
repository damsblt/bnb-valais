export function encodePhotoPath(path: string): string {
  return path
    .split("/")
    .map((part, index) => (index === 0 && part === "" ? "" : encodeURIComponent(part)))
    .join("/");
}
