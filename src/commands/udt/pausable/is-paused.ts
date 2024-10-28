import {HasherCkb, numToBytes, numToHex} from '@ckb-ccc/core'
import {Args, Command, Flags} from '@oclif/core'
import {cccA} from '@ckb-ccc/core/advanced'
import axios from 'axios'

export default class UdtPausableIsPaused extends Command {
  static override args = {
    target: Args.string({description: 'Target cell'}),
    index: Args.integer({description: 'Index of the target cell'}),
    lock_hash: Args.string({description: 'Lock hash in hex. Variable length'}),
  }

  static strict = false;

  static override description = 'describe the command here'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    level: Flags.string({
      char: 'l',
      description: 'name to print',
      options: ['code', 'cell', 'transaction'],
      default: 'code',
    }),
  }

  public encodeU832Array(val: Array<Uint8Array>): Uint8Array {
    if (val.some((arr) => arr.length !== 32)) {
      throw new Error('Each inner array must be exactly 32 bytes.')
    }

    // Convert the length to a 4-byte little-endian array
    const lengthBytes = new Uint8Array(new Uint32Array([val.length]).buffer)
    console.log('lengthBytes:', lengthBytes);

    // Flatten the 2D array of 32-byte elements into a single array
    const flattenedBytes = val.reduce((acc, curr) => {
      acc.push(...curr)
      return acc
    }, [] as number[])

    // Combine the length bytes with the flattened byte array
    return new Uint8Array([...lengthBytes, ...flattenedBytes])
  }

  public encodeHex(data: Uint8Array): string {
    // Convert each byte to a two-character hex string
    return Array.from(data, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  public decodeHex(data: string): Uint8Array {
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
  
  public async run(): Promise<void> {
    const {argv, flags} = await this.parse(UdtPausableIsPaused)
    let lockHashU832Array = [];
    console.log('argv:', argv);
    for (const lock_hash of argv) {
      lockHashU832Array.push(numToBytes(String(lock_hash), 32).reverse());
    }
    console.log('lockHashU832Array:', lockHashU832Array);
    const lockHashU832ArrayEncoded = this.encodeU832Array(lockHashU832Array);
    console.log('lockHashArrayEncoded:', lockHashU832ArrayEncoded);
    const lockHashU832ArrayEncodedHex = this.encodeHex(lockHashU832ArrayEncoded);

    // Method path hex function
    const hasher = new HasherCkb();
    const isPausedPathHex = hasher.update(Buffer.from('UDT.is_paused')).digest().slice(0, 18);
    console.debug('hashed method path hex:', isPausedPathHex);

    // Define URL
    const url = 'http://localhost:9090';

    // Define the JSON payload
    const payload = {
      id: 2,
      jsonrpc: '2.0',
      method: 'run_script_level_code',
      params: [
        "0xe06146dc630f96b3fb0a6cbaf81350b87aa8f195745bdf21d6d4f6de2f53d0cc",
        // args.target, 
        0,
        // args.index, 
        [isPausedPathHex, `0x${lockHashU832ArrayEncodedHex}`]],
    };

    // Send POST request
    axios
      .post(url, payload, {
        headers: {'Content-Type': 'application/json'},
      })
      .then((response) => {
        console.log('Response JSON:', response.data)
      })
      .catch((error) => {
        console.error('Request failed', error)
      })
  }
}
