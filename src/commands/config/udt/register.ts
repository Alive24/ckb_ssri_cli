import {Args, Command, Flags} from '@oclif/core'
import { getCLIConfig, UDTConfig, updateCLIConfig } from '../../../libs/config.js'

export default class ConfigUdtRegister extends Command {
  static override args = {
    jsonString: Args.string({description: 'JsonString', required: true}),
  }

  static override description = 'describe the command here'

  static override examples = [
  ]

  static override flags = {
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(ConfigUdtRegister)

    // Read JSON string as UDTConfig
    const rawUdtConfig = JSON.parse(args.jsonString)

    const parsedUdtConfig: UDTConfig = {
      symbol: rawUdtConfig.symbol,
      code_hash: rawUdtConfig.code_hash,
      args: rawUdtConfig.args,
      cellDepSearchKeys: rawUdtConfig.cellDepSearchKeys,
      decimals: rawUdtConfig.decimals,
    }

    let cliConfig = await getCLIConfig(this.config.configDir);
    cliConfig.UDTRegistry[parsedUdtConfig.symbol] = parsedUdtConfig
    await updateCLIConfig(this.config.configDir, cliConfig);
  }
}
