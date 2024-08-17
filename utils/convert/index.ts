/**
 * Converts a number to a string with commas as thousand separators
 * @param num The number to convert
 * @returns A string representation of the number with commas
 */
export const commaConverter = (num: number | string | null): string => {
  if (typeof num === "number") {
    if (isNaN(num)) {
      return "0";
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  if (typeof num === "string") {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return "0";
};

/**
 * Merges multiple class names into a single string, removing any falsy values
 * @param classes An array of class names or conditional class objects
 * @returns A string of merged class names
 */
export const mergeClassNames = (
  ...classes: (string | undefined | null | false | { [key: string]: boolean })[]
): string => {
  return classes
    .flatMap((cls) => {
      if (typeof cls === "string") return cls;
      if (typeof cls === "object" && cls !== null) {
        return Object.entries(cls)
          .filter(([, value]) => Boolean(value))
          .map(([key]) => key);
      }
      return null;
    })
    .filter(Boolean)
    .join(" ");
};
