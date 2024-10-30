import {HasherCkb, numToBytes, numToHex} from '@ckb-ccc/core'
import {Args, Command, Flags} from '@oclif/core'
import {cccA} from '@ckb-ccc/core/advanced'
import { encodeHex, encodeU832Array } from '../../../libs/utils.js'
import axios from 'axios'

export default class UdtPausableIsPaused extends Command {
  static override args = {
  }

  static strict = false;

  static override description = 'describe the command here'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    target: Flags.string({description: 'Target cell'}),
    index: Flags.integer({description: 'Index of the target cell'}),
    level: Flags.string({
      char: 'l',
      description: 'name to print',
      options: ['code', 'cell', 'transaction'],
      default: 'code',
    }),
  }

  public async run(): Promise<void> {
    const {argv, flags} = await this.parse(UdtPausableIsPaused)
    // Method path hex function
    const hasher = new HasherCkb();
    const enumeratePausedPathHex = hasher.update(Buffer.from('UDT.enumerate_paused')).digest().slice(0, 18);
    console.debug('hashed method path hex:', enumeratePausedPathHex);

    // Define URL
    const url = 'http://localhost:9090';

    // Define the JSON payload
    const payload = {
      id: 2,
      jsonrpc: '2.0',
      method: 'run_script_level_code',
      params: [
        "0x24e477bdae84955713ce9075cc176e87f1c882fa3cedcde4ea3dd6c1ee7b0d5c",
        // args.target, 
        0,
        // args.index, 
        [enumeratePausedPathHex,]],
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
