import { ccc, HasherCkb } from '@ckb-ccc/core'
import {Args, Command, Flags} from '@oclif/core'
import debug from 'debug'
import { getCLIConfig } from '../../../libs/config.js'
import axios from 'axios'

export default class UDTMetadataDecimals extends Command {
  static override args = {
    txHash: Args.string({description: 'txHash of the UDT cell.', required: true}),
    index: Args.integer({description: 'index of the UDT cell.', required: true}),
  }

  static override description = 'describe the command here'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    // flag with no value (-f, --force)
    force: Flags.boolean({char: 'f'}),
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({char: 'n', description: 'name to print'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(UDTMetadataDecimals)
    // Method path hex function
    const hasher = new HasherCkb()
    const decimalPathHex = hasher.update(Buffer.from('UDTMetadata.decimals')).digest().slice(0, 18)
    debug(`enumerate-paused | hashed method path hex: ${decimalPathHex}`)

    const cliConfig = await getCLIConfig(this.config.configDir)
    const client = new ccc.ClientPublicTestnet({url: process.env.CKB_RPC_URL})

    // Define the JSON payload
    const payload = {
      id: 2,
      jsonrpc: '2.0',
      method: 'run_script_level_code',
      params: [args.txHash, Number(args.index), [decimalPathHex]],
    }

    // Send POST request
    axios
      .post(process.env.SSRI_SERVER_URL!, payload, {
        headers: {'Content-Type': 'application/json'},
      })
      .then((response) => {
        console.log('Response JSON:', response.data)
        // TODO: Prettify response.
        return
      })
      .catch((error) => {
        console.error('Request failed', error)
      })
    // TODO: Prettify response.
  }
}
