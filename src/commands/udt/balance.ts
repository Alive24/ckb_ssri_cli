import {Args, Command, Flags} from '@oclif/core'
import {getCLIConfig} from '../../libs/config.js'
import {Address, ccc} from '@ckb-ccc/core'

export default class UDTBalance extends Command {
  static override args = {
    symbol: Args.string({description: 'Symbol of UDT.', required: true}),
    address: Args.string({required: true}),
  }

  static override description =
    'Check UDT Balance through CCC. This is different from calling through purely SSRI which checks only the balance at the script running level.'

  static override examples = [
    'ckb_ssri_cli udt:balance PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqgtlcnzzna2tqst7jw78egjpujn7hdxpackjmmdp',
  ]

  static override flags = {}

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(UDTBalance)

    const cliConfig = await getCLIConfig(this.config.configDir)
    const client = new ccc.ClientPublicTestnet({url: process.env.CKB_RPC_URL})

    const signer = new ccc.SignerCkbPrivateKey(
      client,
      flags.privateKey ??
        cliConfig.accountRegistry[flags.fromAccount ?? '']?.privateKey ??
        process.env.MAIN_WALLET_PRIVATE_KEY!,
    )

    const {script: userLock} = await ccc.Address.fromString(args.address, signer.client)
    const udtConfig = cliConfig.UDTRegistry[args.symbol]
    const udtTypeScript = new ccc.Script(udtConfig.code_hash, 'type', udtConfig.args)

    let balanceTotal = BigInt(0)
    for await (const cell of client.findCellsByLock(userLock, udtTypeScript, true)) {
      balanceTotal += ccc.udtBalanceFrom(cell.outputData)
    }
    this.log(`Total balance of ${args.symbol} for ${args.address}: ${(Number(balanceTotal.toString()) / 10 ** udtConfig.decimals).toFixed(udtConfig.decimals)}`)
  }
}
