export function encodeU832Array(val: Array<Uint8Array>): Uint8Array {
  if (val.some(arr => arr.length !== 32)) {
      throw new Error("Each inner array must be exactly 32 bytes.");
  }

  // Convert the length to a 4-byte little-endian array
  const lengthBytes = new Uint8Array(new Uint32Array([val.length]).buffer);

  // Flatten the 2D array of 32-byte elements into a single array
  const flattenedBytes = val.reduce((acc, curr) => {
      acc.push(...curr);
      return acc;
  }, [] as number[]);

  // Combine the length bytes with the flattened byte array
  return new Uint8Array([...lengthBytes, ...flattenedBytes]);
}