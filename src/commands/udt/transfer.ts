import {ccc, Cell, CellDepLike} from '@ckb-ccc/core'
import {Args, Command, Flags} from '@oclif/core'
import {getCellDepsFromSearchKeys, getUDTConfig} from '../../libs/config.js'

export default class UdtTransfer extends Command {
  static override args = {
    symbol: Args.string({description: 'Symbol of UDT to transfer.', required: true}),
    toAddress: Args.string({description: 'file to read', required: true}),
    toAmount: Args.string({
      description:
        'Amount with decimals. e.g. 1 USDT would be 1 instead of 100000000. You can transfer amount like 0.1.',
      required: true,
    }),
  }

  static override description = 'describe the command here'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    transactionJson: Flags.file({}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(UdtTransfer)

    const client = new ccc.ClientPublicTestnet({url: process.env.CKB_RPC_URL})
    const signer = new ccc.SignerCkbPrivateKey(client, process.env.MAIN_WALLET_PRIVATE_KEY!)
    const toLock = (await ccc.Address.fromString(args.toAddress, signer.client)).script

    const udtConfig = getUDTConfig(args.symbol)
    const udtTypeScript = new ccc.Script(udtConfig.code_hash, 'type', udtConfig.args)

    const transferTx = ccc.Transaction.from({
      outputs: [
        {
          lock: toLock,
          type: udtTypeScript,
        },
      ],
      outputsData: [ccc.numLeToBytes(Math.floor(Number(args.toAmount) * 10 ** udtConfig.decimals), 16)],
    })
    await transferTx.completeInputsByUdt(signer, udtTypeScript)
    await transferTx.completeInputsByCapacity(signer)
    await transferTx.completeFeeBy(signer)

    transferTx.addCellDeps(await getCellDepsFromSearchKeys(client, udtConfig.cellDepSearchKeys))
    const transferTxTxHash = await signer.sendTransaction(transferTx)

    this.log(`Transferred UDT with transaction hash: ${transferTxTxHash}`)

    // TODO: Process error.
  }
}
