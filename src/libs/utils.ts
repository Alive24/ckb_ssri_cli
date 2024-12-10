import {Address, Script} from '@ckb-ccc/core'
import {cccA} from '@ckb-ccc/core/advanced'
import {BytesVec} from '@ckb-lumos/base/lib/blockchain.js'

export function encodeU832Array(val: Array<Uint8Array>): Uint8Array {
  if (val.some((arr) => arr.length !== 32)) {
    throw new Error('Each inner array must be exactly 32 bytes.')
  }

  // Convert the length to a 4-byte little-endian array
  const lengthBytes = new Uint8Array(new Uint32Array([val.length]).buffer)

  // Flatten the 2D array of 32-byte elements into a single array
  const flattenedBytes = val.reduce((acc, curr) => {
    acc.push(...curr)
    return acc
  }, [] as number[])

  // Combine the length bytes with the flattened byte array
  return new Uint8Array([...lengthBytes, ...flattenedBytes])
}

export function decodeU832Array(data: Uint8Array): Array<Uint8Array> {
  if (data.length < 4) {
    throw new Error('Input data is too short to contain a length.')
  }

  // Extract the length as a little-endian 4-byte integer
  const length = new Uint32Array(data.slice(0, 4).buffer)[0]

  // Extract the 32-byte elements from the remaining data
  const result = []
  for (let i = 0; i < length; i++) {
    const start = 4 + i * 32
    const end = 4 + (i + 1) * 32
    result.push(data.slice(start, end))
  }

  return result
}

export function encodeHex(data: Uint8Array): string {
  // Convert each byte to a two-character hex string
  return Array.from(data, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function decodeHex(data: string): Uint8Array {
  if (data.length % 2 !== 0) {
    throw new Error('Invalid hex string: must have an even length.')
  }

  // Convert the hex string into a Uint8Array
  const result = new Uint8Array(data.length / 2)
  for (let i = 0; i < data.length; i += 2) {
    result[i / 2] = parseInt(data.slice(i, i + 2), 16)
  }

  return result
}

export function encodeLockArray(val: Array<Script>): Uint8Array {
  return BytesVec.pack([...val.map((lock) => lock.toBytes())])
}
export function encodeU128Array(val: Array<cccA.moleculeCodecCkb.Uint128>): Uint8Array {
  // Convert the length to a 4-byte little-endian array
  const lengthBytes = new Uint8Array(new Uint32Array([val.length]).buffer)

  // Flatten the array of Uint128 elements into a single array
  const flattenedBytes = val.flatMap((curr) => {
    return Array.from(new Uint8Array(curr.raw()))
  })

  // Combine the length bytes with the flattened byte array
  return new Uint8Array([...lengthBytes, ...flattenedBytes])
}
