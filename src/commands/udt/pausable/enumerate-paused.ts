import {ccc, Cell, CellDepLike, HasherCkb, numToBytes, numToHex} from '@ckb-ccc/core'
import {Args, Command, Flags} from '@oclif/core'
import {cccA} from '@ckb-ccc/core/advanced'
import {encodeHex, encodeU832Array} from '../../../libs/utils.js'
import axios from 'axios'
import {getCellDepsFromSearchKeys, getCLIConfig} from '../../../libs/config.js'

export default class UDTPausableEnumeratePaused extends Command {
  static override args = {
    symbol: Args.string({description: 'Symbol of UDT to mint.', required: true}),
  }

  static strict = false

  static override description =
    'Enumerate the pause list of the token. Note: This command should be transaction level if using external pause list.'
  // TODO: Automatic redirect to transactions with the latest cell dep.
  static override examples = ['ckb_ssri_sli udt:pausable:enumerate-paused PUDT']

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
    const {args, flags} = await this.parse(UDTPausableEnumeratePaused)
    // Method path hex function
    const hasher = new HasherCkb()
    const enumeratePausedPathHex = hasher.update(Buffer.from('UDTPausable.enumerate_paused')).digest().slice(0, 18)
    this.debug(`enumerate-paused | hashed method path hex: ${enumeratePausedPathHex}`)

    const cliConfig = await getCLIConfig(this.config.configDir)
    const client = new ccc.ClientPublicTestnet({url: process.env.CKB_RPC_URL})
    const udtConfig = cliConfig.UDTRegistry[args.symbol]

    const codeCellDep = (await getCellDepsFromSearchKeys(client, udtConfig.cellDepSearchKeys))[0]

    // Define the JSON payload
    const payload = {
      id: 2,
      jsonrpc: '2.0',
      method: 'run_script_level_code',
      params: [codeCellDep.outPoint.txHash, Number(codeCellDep.outPoint.index), [enumeratePausedPathHex]],
    }

    // Send POST request
    try {
      const response = await axios.post(process.env.SSRI_SERVER_URL!, payload, {
        headers: {'Content-Type': 'application/json'},
      })

      this.debug('Response JSON:', response.data)

      const lengthBytes = new Uint8Array(4)
      for (let i = 0; i < 8; i += 2) {
        lengthBytes[i / 2] = parseInt(
          response.data.result
            .toString()
            .slice(2)
            .slice(i, i + 2),
          16,
        )
      }

      const pauseListLength = new cccA.moleculeCodecCkb.Uint32(lengthBytes)
      this.log(`Pause List Length: ${pauseListLength.toLittleEndianUint32()}`)

      const pauseListHex = response.data.result.toString().slice(10)
      const pauseList = []
      for (let i = 0; i < pauseListHex.length; i += 64) {
        pauseList.push(pauseListHex.slice(i, i + 64))
      }

      this.log(`Pause List: \n${pauseList}`)
      return
    } catch (error) {
      console.error('Request failed', error)
    }
    // TODO: Prettify response.
  }
}
