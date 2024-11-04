import {ccc, Cell, CellDepLike} from '@ckb-ccc/core'
import {Args, Command, Flags} from '@oclif/core'
import {getCellDepsFromSearchKeys, getCLIConfig} from '../../libs/config.js'

export default class UDTTransfer extends Command {
  static override args = {
    symbol: Args.string({description: 'Symbol of UDT to transfer.', required: true}),
    toAddress: Args.string({description: 'file to read', required: true}),
    toAmount: Args.string({
      description:
        'Amount with decimals. e.g. 1 USDT would be 1 instead of 100000000. You can transfer amount like 0.1.',
      required: true,
    }),
  }

  static override description = 'Transfer UDT to an address.'

  static override examples = [
    'ckb-ssri-cli udt:transfer PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqgtlcnzzna2tqst7jw78egjpujn7hdxpackjmmdp 100',
  ]

  static override flags = {
    privateKey: Flags.string({
      description: 'Use specific private key to sign. Will use MAIN_WALLET_PRIVATE_KEY from .env by default.',
    }),
    fromAccount: Flags.string({
      description: 'Use specific account to sign. Will use MAIN_WALLET_PRIVATE_KEY from .env by default.',
    }),
    // TODO: Implement fromTransactionJson and holdSend.
    fromTransactionJson: Flags.file({
      description:
        'Assemble transaction on the basis of a previous action; use together with holdSend to make multiple transfers within the same transaction.',
    }),
    holdSend: Flags.boolean({
      description:
        'Hold the transaction and send it later. Will output the transaction JSON. Use together with fromTransactionJson to make multiple transfers within the same transaction.',
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(UDTTransfer)

    const client = new ccc.ClientPublicTestnet({url: process.env.CKB_RPC_URL})
    const signer = new ccc.SignerCkbPrivateKey(client, process.env.MAIN_WALLET_PRIVATE_KEY!)
    const toLock = (await ccc.Address.fromString(args.toAddress, signer.client)).script

    const cliConfig = await getCLIConfig(this.config.configDir)
    const udtConfig = cliConfig.UDTRegistry[args.symbol]
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

    this.log(`Transferred ${args.toAmount} ${args.symbol} to ${args.toAddress}. Tx hash: ${transferTxTxHash}`)

    // TODO: Process error.
  }
}
