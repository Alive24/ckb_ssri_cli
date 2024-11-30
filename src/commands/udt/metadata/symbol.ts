import { ccc, HasherCkb } from '@ckb-ccc/core'
import {Args, Command, Flags} from '@oclif/core'
import { getCLIConfig } from '../../../libs/config.js'
import axios from 'axios'

export default class UDTMetadataSymbol extends Command {
  static override args = {
    txHash: Args.string({description: 'txHash of the UDT cell (Note: Not the script cell).', required: true}),
    index: Args.integer({description: 'index of the UDT cell (Note: Not the script cell).', required: true}),
  }

  static override description = 'Return the symbol of the UDT cell. Will automatically route to the script cell for direct calling.'

  static override examples = ['ckb_ssri_cli udt:metadata:symbol 0x5a68061c57b753c941919e42d74254f878ae2786387e42c1b835980443cb5cc8 0']

  static override flags = {
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(UDTMetadataSymbol)
    // Method path hex function
    const hasher = new HasherCkb()
    const symbolPathHex = hasher.update(Buffer.from('UDTMetadata.symbol')).digest().slice(0, 18)
    this.debug(`Hashed method path hex: ${symbolPathHex}`)

    const client = new ccc.ClientPublicTestnet({url: process.env.CKB_RPC_URL})
    
    let targetTransactionResponse = await client.getTransaction(args.txHash)
    if (!targetTransactionResponse) {
      throw Error('client.getTransaction(txHashLike) failed.')
    }

    const targetCellTypeScript = targetTransactionResponse.transaction.outputs[args.index].type
    if (!targetCellTypeScript) {
      throw Error('No Type Script found for target Cell.')
    }

    const targetCellTypeScriptCodeHash = targetCellTypeScript.codeHash
    let matchingCellDep = null
    for (const cellDep of targetTransactionResponse.transaction.cellDeps) {
      this.debug(`cellDepOutpointTxHash: ${cellDep.outPoint.txHash}`)

      const scriptCell = await client.getCell(cellDep.outPoint)
      // TODO: Limit TypeID cell.
      this.debug(`scriptCellTypeHash: ${scriptCell?.cellOutput.type?.hash()}`)

      if (scriptCell?.cellOutput.type?.hash() === targetCellTypeScriptCodeHash) {
        matchingCellDep = cellDep
        break
      }
    }

    if (!matchingCellDep) {
      throw Error('No matching cellDep found.')
    }
    // Define the JSON payload
    const payload = {
      id: 2,
      jsonrpc: '2.0',
      method: 'run_script_level_code',
      params: [matchingCellDep.outPoint.txHash, Number(matchingCellDep.outPoint.index), [symbolPathHex]],
    }

    // Send POST request
    axios
      .post(process.env.SSRI_SERVER_URL!, payload, {
        headers: {'Content-Type': 'application/json'},
      })
      .then((response) => {
        this.log('Response JSON:', response.data)
      // ISSUE: [Prettify responses from SSRI calls #21](https://github.com/Alive24/ckb_ssri_cli/issues/21)
        return
      })
      .catch((error) => {
        console.error('Request failed', error)
      })
      // ISSUE: [Prettify responses from SSRI calls #21](https://github.com/Alive24/ckb_ssri_cli/issues/21)
  }
}
