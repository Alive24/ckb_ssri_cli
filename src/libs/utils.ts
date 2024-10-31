import debug from "debug";

export function encodeU832Array(val: Array<Uint8Array>): Uint8Array {
  if (val.some((arr) => arr.length !== 32)) {
    throw new Error('Each inner array must be exactly 32 bytes.')
  }

  // Convert the length to a 4-byte little-endian array
  const lengthBytes = new Uint8Array(new Uint32Array([val.length]).buffer)
  debug(`encodeU832Array | lengthBytes: ${lengthBytes}`);

  // Flatten the 2D array of 32-byte elements into a single array
  const flattenedBytes = val.reduce((acc, curr) => {
    acc.push(...curr)
    return acc
  }, [] as number[])

  // Combine the length bytes with the flattened byte array
  return new Uint8Array([...lengthBytes, ...flattenedBytes])
}

export function encodeHex(data: Uint8Array): string {
  // Convert each byte to a two-character hex string
  return Array.from(data, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function decodeHex(data: string): Uint8Array {
  if (data.length % 2 !== 0) {
    throw new Error("Invalid hex string: must have an even length.");
  }

  // Convert the hex string into a Uint8Array
  const result = new Uint8Array(data.length / 2);
  for (let i = 0; i < data.length; i += 2) {
    result[i / 2] = parseInt(data.slice(i, i + 2), 16);
  }

  return result;
}