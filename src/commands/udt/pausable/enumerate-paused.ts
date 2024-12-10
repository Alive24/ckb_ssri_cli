import {ccc, Cell, CellDepLike, HasherCkb, numToBytes, numToHex} from '@ckb-ccc/core'
import {Args, Command, Flags} from '@oclif/core'
import {cccA} from '@ckb-ccc/core/advanced'
import {decodeHex, encodeHex, encodeU832Array} from '../../../libs/utils.js'
import axios from 'axios'
import {getCellDepsFromSearchKeys, getCLIConfig} from '../../../libs/config.js'
import {array, dynvec, option, struct, table, vector} from '@ckb-lumos/codec/lib/molecule/layout.js'
import {Byte32, Bytes, BytesVec, Script} from '@ckb-lumos/base/lib/blockchain.js'
import {BIish, Uint8} from '@ckb-lumos/codec/lib/number/uint.js'

export default class UDTPausableEnumeratePaused extends Command {
  static override args = {
    symbol: Args.string({description: 'Symbol of UDT to mint.', required: true}),
  }

  static strict = false

  static override description =
    'Enumerate the pause list of the token. Note: This command should be transaction level if using external pause list.'
  // ISSUE: [Automatic redirect to transactions with the latest cell dep. #25](https://github.com/Alive24/ckb_ssri_cli/issues/25)
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

  // ISSUE: [Raise enumerate-paused to transaction level for external pause list. #26](https://github.com/Alive24/ckb_ssri_cli/issues/26)
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

    let offsetHex = encodeHex(ccc.numLeToBytes(0, 4))
    let limitHex = encodeHex(ccc.numLeToBytes(0, 4))

    // Define the JSON payload
    const payload = {
      id: 2,
      jsonrpc: '2.0',
      method: 'run_script_level_code',
      params: [
        codeCellDep.outPoint.txHash,
        Number(codeCellDep.outPoint.index),
        [enumeratePausedPathHex, `0x${offsetHex}`, `0x${limitHex}`],
      ],
    }

    const u832Codec = array(Uint8, 32)
    const u832VecCodec = vector(u832Codec)

    const udtPausableDataCodec = table(
      {
        pause_list: u832VecCodec,
        next_type_script: option(Script)
      },
      ['pause_list', 'next_type_script'],
    )

    try {
      const response = await axios.post(process.env.SSRI_SERVER_URL!, payload, {
        headers: {'Content-Type': 'application/json'},
      })
      const udtPausableDataInBytesVec = BytesVec.unpack(response.data.result)
      for (const udtPausableDataInBytes of udtPausableDataInBytesVec) {
        this.log('udtPausableDataInBytes:', udtPausableDataInBytes)
        const udtPausableData = udtPausableDataCodec.unpack(udtPausableDataInBytes)
        this.log('Parsed udtPausableData:', udtPausableData)
      }
      return
    } catch (error) {
      console.error('Request failed', error)
    }
    // ISSUE: [Prettify responses from SSRI calls #21](https://github.com/Alive24/ckb_ssri_cli/issues/21)
  }
}
