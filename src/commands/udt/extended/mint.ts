import {ccc, Cell, CellDep, CellDepLike} from '@ckb-ccc/core'
import {Args, Command, Flags} from '@oclif/core'
import {getCellDepsFromSearchKeys, getCLIConfig} from '../../../libs/config.js'
import 'dotenv/config'

export default class UDTExtendedMint extends Command {
  static override args = {
    symbol: Args.string({description: 'Symbol of UDT to mint.', required: true}),
    toAddress: Args.string({description: 'file to read', required: true}),
    toAmount: Args.string({
      description: 'Amount with decimals. e.g. 1 USDT would be 1 instead of 100000000',
      required: true,
    }),
  }

  static override description =
    'Mint UDT to an address. Make sure you have the mint permission to the token. It overrides pause list.'

  static override examples = [
    'ckb_ssri_cli udt:extended:mint PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqgtlcnzzna2tqst7jw78egjpujn7hdxpackjmmdp 100',
  ]

  static override flags = {
    privateKey: Flags.string({
      description: 'Use specific private key to sign. Will use MAIN_WALLET_PRIVATE_KEY from .env by default.',
    }),
    fromAccount: Flags.string({
      description: 'Use specific account to sign. Will use MAIN_WALLET_PRIVATE_KEY from .env by default.',
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(UDTExtendedMint)

    const CLIConfig = await getCLIConfig(this.config.configDir)
    // TODO: Mainnet support.
    const client = new ccc.ClientPublicTestnet({url: process.env.CKB_RPC_URL})
    const signer = new ccc.SignerCkbPrivateKey(
      client,
      flags.privateKey ?? flags.fromAccount !== undefined
        ? CLIConfig.accountRegistry[flags.fromAccount ?? ''].privateKey
        : process.env.MAIN_WALLET_PRIVATE_KEY!,
    )

    const toLock = (await ccc.Address.fromString(args.toAddress, signer.client)).script

    const udtConfig = CLIConfig.UDTRegistry[args.symbol]
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

    // TODO: At the moment only simple lock script is supported. Should support more in the future, particularly proxy lock.
    try {
      const mintTxHash = await signer.sendTransaction(mintTx)
      this.log(`Minted ${args.toAmount} ${args.symbol} to ${args.toAddress}. Tx hash: ${mintTxHash}`)
    } catch (error: any) {
      this.error(error)
    }
  }
}
