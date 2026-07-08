export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function capitalize(input: string): string {
  return input.length === 0 ? input : input[0]!.toUpperCase() + input.slice(1);
}

export function titleCase(input: string): string {
  return input.split(/\s+/).map(capitalize).join(" ");
}

export function padNumber(value: number, length: number): string {
  return value.toString().padStart(length, "0");
}

/** Strips diacritics/non-ASCII and lowercases, for building emails/usernames from arbitrary names. */
export function transliterate(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
}

export function base64Url(input: string): string {
  const base64 = btoa(input);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
