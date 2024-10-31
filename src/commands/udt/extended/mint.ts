import {ccc, Cell, CellDep, CellDepLike} from '@ckb-ccc/core'
import {Args, Command, Flags} from '@oclif/core'
import {getCellDepsFromSearchKeys, getUDTConfig} from '../../../libs/config.js'
import 'dotenv/config'

export default class UdtExtendedMint extends Command {
  static override args = {
    symbol: Args.string({description: 'Symbol of UDT to mint.', required: true}),
    toAddress: Args.string({description: 'file to read', required: true}),
    toAmount: Args.string({
      description: 'Amount with decimals. e.g. 1 USDT would be 1 instead of 100000000',
      required: true,
    }),
  }

  static override description = 'describe the command here'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    privateKey: Flags.string({
      description: 'Use specific private key to sign. Will use MAIN_WALLET_PRIVATE_KEY from .env by default.',
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(UdtExtendedMint)

    const client = new ccc.ClientPublicTestnet({url: process.env.CKB_RPC_URL})
    const signer = new ccc.SignerCkbPrivateKey(client, args.toAddress ?? process.env.MAIN_WALLET_PRIVATE_KEY!)

    const toLock = (await ccc.Address.fromString(args.toAddress, signer.client)).script

    const udtConfig = getUDTConfig(args.symbol)
    const udtTypeScript = new ccc.Script(udtConfig.code_hash, 'type', udtConfig.args)

    const mintTx = ccc.Transaction.from({
      outputs: [
        {
          lock: toLock,
          type: udtTypeScript,
        },
      ],
      outputsData: [ccc.numLeToBytes(Math.floor(Number(args.toAmount) * 10 ** udtConfig.decimals), 16)],
    })

    await mintTx.completeInputsByCapacity(signer)
    await mintTx.completeFeeBy(signer)

    mintTx.addCellDeps(await getCellDepsFromSearchKeys(client, udtConfig.cellDepSearchKeys))
    const mintTxHash = await signer.sendTransaction(mintTx)

    this.log(`Minted UDT with transaction hash: ${mintTxHash}`)
  }
}
