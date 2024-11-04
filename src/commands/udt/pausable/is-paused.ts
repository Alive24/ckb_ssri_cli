import {ccc, Cell, CellDepLike, HasherCkb, numToBytes, numToHex} from '@ckb-ccc/core'
import {Args, Command, Flags} from '@oclif/core'
import {cccA} from '@ckb-ccc/core/advanced'
import {encodeHex, encodeU832Array} from '../../../libs/utils.js'
import axios from 'axios'
import {getCellDepsFromSearchKeys, getCLIConfig} from '../../../libs/config.js'
import debug from 'debug'

export default class UDTPausableIsPaused extends Command {
  static override args = {
    symbol: Args.string({description: 'Symbol of UDT to mint.', required: true}),
    lock_hash: Args.string({description: 'Lock hash in hex. Variable length'}),
  }

  static strict = false

  static override description = 'Inspect an array of specific lock hashes to see if any one of they are paused. Note that this command is transaction specific if using external pause list.'

  static override examples = ['ckb_ssri_sli udt:pausable:is-paused PUDT 0xd19228c64920eb8c3d79557d8ae59ee7a14b9d7de45ccf8bafacf82c91fc359e']

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
    const {args, argv, flags} = await this.parse(UDTPausableIsPaused)
    let lockHashU832Array = []
    for (const lock_hash of argv.slice(1)) {
      lockHashU832Array.push(numToBytes(String(lock_hash), 32).reverse())
    }
    debug(`is-paused | lockHashU832Array: ${lockHashU832Array}`)
    const lockHashU832ArrayEncoded = encodeU832Array(lockHashU832Array)
    debug(`is-paused | lockHashArrayEncoded: ${lockHashU832ArrayEncoded}`)
    const lockHashU832ArrayEncodedHex = encodeHex(lockHashU832ArrayEncoded)

    // Method path hex function
    const hasher = new HasherCkb()
    const isPausedPathHex = hasher.update(Buffer.from('UDT.is_paused')).digest().slice(0, 18)
    debug(`is-paused | hashed method path hex:${isPausedPathHex}`)

    const client = new ccc.ClientPublicTestnet({url: process.env.CKB_RPC_URL})
    const cliConfig = await getCLIConfig(this.config.configDir)
    const udtConfig = cliConfig.UDTRegistry[args.symbol]

    const codeCellDep = (await getCellDepsFromSearchKeys(client, udtConfig.cellDepSearchKeys))[0]
    // Define the JSON payload
    const payload = {
      id: 2,
      jsonrpc: '2.0',
      method: 'run_script_level_code',
      params: [
        codeCellDep.outPoint.txHash,
        Number(codeCellDep.outPoint.index),
        // args.index,
        [isPausedPathHex, `0x${lockHashU832ArrayEncodedHex}`],
      ],
    }

    // Send POST request
    axios
      .post(process.env.SSRI_SERVER_URL!, payload, {
        headers: {'Content-Type': 'application/json'},
      })
      .then((response) => {
        this.log('Response JSON:', response.data)
        return
      })
      .catch((error) => {
        console.error('Request failed', error)
      })
    // TODO: Prettify response.
  }
}
