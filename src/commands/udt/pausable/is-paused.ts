import {ccc, Cell, CellDepLike, HasherCkb, numToBytes, numToHex} from '@ckb-ccc/core'
import {Args, Command, Flags} from '@oclif/core'
import {cccA} from '@ckb-ccc/core/advanced'
import { encodeHex, encodeU832Array } from '../../../libs/utils.js'
import axios from 'axios'
import { getCellDepsFromSearchKeys, getUDTConfig } from '../../../libs/config.js'
import debug from 'debug'

export default class UdtPausableIsPaused extends Command {
  static override args = {
    symbol: Args.string({description: 'Symbol of UDT to mint.', required: true}),
    lock_hash: Args.string({description: 'Lock hash in hex. Variable length'}),
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
    const {args, argv, flags} = await this.parse(UdtPausableIsPaused)
    let lockHashU832Array = [];
    for (const lock_hash of argv.slice(1)) {
      lockHashU832Array.push(numToBytes(String(lock_hash), 32).reverse());
    }
    debug(`is-paused | lockHashU832Array: ${lockHashU832Array}`);
    const lockHashU832ArrayEncoded = encodeU832Array(lockHashU832Array);
    debug(`is-paused | lockHashArrayEncoded: ${lockHashU832ArrayEncoded}`);
    const lockHashU832ArrayEncodedHex = encodeHex(lockHashU832ArrayEncoded);

    // Method path hex function
    const hasher = new HasherCkb();
    const isPausedPathHex = hasher.update(Buffer.from('UDT.is_paused')).digest().slice(0, 18);
    debug(`is-paused | hashed method path hex:${isPausedPathHex}`);

    const client = new ccc.ClientPublicTestnet({ url: process.env.CKB_RPC_URL });
    const udtConfig = getUDTConfig(args.symbol);

    const codeCellDep = (await getCellDepsFromSearchKeys(client, udtConfig.cellDepSearchKeys))[0];
    // Define the JSON payload
    const payload = {
      id: 2,
      jsonrpc: '2.0',
      method: 'run_script_level_code',
      params: [
        codeCellDep.outPoint.txHash,
        Number(codeCellDep.outPoint.index),
        // args.index, 
        [isPausedPathHex, `0x${lockHashU832ArrayEncodedHex}`]],
    };

    // Send POST request
    axios
      .post(process.env.SSRI_SERVER_URL!, payload, {
        headers: {'Content-Type': 'application/json'},
      })
      .then((response) => {
        this.log('Response JSON:', response.data)
      })
      .catch((error) => {
        console.error('Request failed', error)
      });
    // TODO: Prettify response.
  }
}
