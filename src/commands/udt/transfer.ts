import {Args, Command, Flags} from '@oclif/core'

export default class UdtTransfer extends Command {
  static override args = {
    toAddress: Args.string({description: 'file to read'}),
    toAmount: Args.string({description: 'Amount with decimals. e.g. 1 USDT would be 1 instead of 100000000'}),
  }

  static override description = 'describe the command here'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {
    // flag with no value (-f, --force)
    transactionJson: Flags.file({}),
    // flag with a value (-n, --name=VALUE)
  }
  // TODO: Get signer
  public async run(): Promise<void> {
    const {args, flags} = await this.parse(UdtTransfer);
    // const newToAddress = ccc.Address.fromString(args.toAddress!, signer.client);
    
  }
}
