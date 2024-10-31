import {ccc, Cell, CellDepLike, HasherCkb, numToBytes, numToHex} from '@ckb-ccc/core'
import {Args, Command, Flags} from '@oclif/core'
import {cccA} from '@ckb-ccc/core/advanced'
import {encodeHex, encodeU832Array} from '../../../libs/utils.js'
import axios from 'axios'
import {getCellDepsFromSearchKeys, getUDTConfig} from '../../../libs/config.js'
import {debug} from 'debug'

export default class UdtPausableIsPaused extends Command {
  static override args = {
    symbol: Args.string({description: 'Symbol of UDT to mint.', required: true}),
  }

  static strict = false

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

  // TODO: This would only work for code only pause list at the moment. Will need to raise to transaction level for external metadata/pause data cell.
  public async run(): Promise<void> {
    const {args, flags} = await this.parse(UdtPausableIsPaused)
    // Method path hex function
    const hasher = new HasherCkb()
    const enumeratePausedPathHex = hasher.update(Buffer.from('UDT.enumerate_paused')).digest().slice(0, 18)
    debug(`enumerate-paused | hashed method path hex: ${enumeratePausedPathHex}`)

    const client = new ccc.ClientPublicTestnet({url: process.env.CKB_RPC_URL})
    const udtConfig = getUDTConfig(args.symbol)

    const codeCellDep = (await getCellDepsFromSearchKeys(client, udtConfig.cellDepSearchKeys))[0];

    // Define the JSON payload
    const payload = {
      id: 2,
      jsonrpc: '2.0',
      method: 'run_script_level_code',
      params: [codeCellDep.outPoint.txHash, Number(codeCellDep.outPoint.index), [enumeratePausedPathHex]],
    }

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
      })
    // TODO: Prettify response.
  }
}
