/**
 * Parses a description string that may contain a serialized JSON metadata block
 * for quality prices, returning the clean description text and the quality prices.
 *
 * Format:
 * [Description text...]
 * ---QUALITY_PRICES---
 * {"1":350,"2":450,"3":980,"4":600}
 */
export function parseDescription(description: string): {
  text: string;
  qualityPrices: Record<string, number>;
} {
  if (!description) {
    return { text: "", qualityPrices: {} };
  }

  const separator = "---QUALITY_PRICES---";
  const parts = description.split(separator);

  if (parts.length < 2) {
    return { text: description.trim(), qualityPrices: {} };
  }

  const text = parts[0].trim();
  const jsonPart = parts[1].trim();

  try {
    const qualityPrices = JSON.parse(jsonPart);
    // Ensure all values are numeric
    const cleanPrices: Record<string, number> = {};
    Object.keys(qualityPrices).forEach((key) => {
      const val = Number(qualityPrices[key]);
      if (!isNaN(val)) {
        cleanPrices[key] = val;
      }
    });
    return { text, qualityPrices: cleanPrices };
  } catch (error) {
    console.error("Error parsing quality prices JSON metadata:", error);
    return { text, qualityPrices: {} };
  }
}

/**
 * Serializes the description text and active quality prices map into a single string
 * using the metadata block separator.
 */
export function serializeDescription(
  text: string,
  qualityPrices: Record<string, number>
): string {
  const cleanText = (text || "").trim();
  const separator = "---QUALITY_PRICES---";

  // Filter out any qualities that don't have valid numeric prices
  const validPrices: Record<string, number> = {};
  Object.keys(qualityPrices).forEach((key) => {
    const price = Number(qualityPrices[key]);
    if (price > 0 && !isNaN(price)) {
      validPrices[key] = price;
    }
  });

  if (Object.keys(validPrices).length === 0) {
    return cleanText;
  }

  return `${cleanText}\n\n${separator}\n${JSON.stringify(validPrices)}`;
}
