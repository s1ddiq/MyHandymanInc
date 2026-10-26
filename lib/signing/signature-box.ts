export type SignatureBox = {
  /** Zero-based page index. */
  page: number;
  /** Position and size as fractions of the page, from 0 to 1. */
  x: number;
  y: number;
  width: number;
  height: number;
};

export function isValidSignatureBox(value: unknown): value is SignatureBox {
  if (!value || typeof value !== "object") return false;

  const box = value as Record<string, unknown>;
  const numbers = [box.x, box.y, box.width, box.height];

  return (
    Number.isInteger(box.page) &&
    (box.page as number) >= 0 &&
    numbers.every(
      (number) => typeof number === "number" && Number.isFinite(number),
    ) &&
    (box.x as number) >= 0 &&
    (box.y as number) >= 0 &&
    (box.width as number) > 0 &&
    (box.height as number) > 0 &&
    (box.x as number) + (box.width as number) <= 1 &&
    (box.y as number) + (box.height as number) <= 1
  );
}
