import {Args, Command, Flags} from '@oclif/core'
import { getCLIConfig, UDTConfig, updateCLIConfig } from '../../../libs/config.js'

export default class ConfigUDTRegister extends Command {
  static override args = {
    jsonString: Args.string({description: 'JsonString', required: true}),
  }

  static override description = 'Register a UDT to the CLI config with JSONString of UDTConfig.'

  static override examples = [
    'ckb-ssri-cli config:udt:register "{\"code_hash\":\"0x5fe5d5930122a972819aba74a2efa534522bd326bb146136950095e57a55c9be\",\"args\":\"0xb5202efa0f2d250af66f0f571e4b8be8b272572663707a052907f8760112fe35\",\"symbol\":\"PUDT\",\"decimals\":8,\"cellDepSearchKeys\":[{\"script\":{\"codeHash\":\"0x00000000000000000000000000000000000000000000000000545950455f4944\",\"hashType\":\"type\",\"args\":\"0x2035d31c47fafd6c1ddb50396c5bcd5b76f24539763ef4fca785022855068ca8\"},\"scriptType\":\"type\",\"scriptSearchMode\":\"exact\"}]}"'
  ]

  static override flags = {
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(ConfigUDTRegister)

    // Read JSON string as UDTConfig
    const rawUDTConfig = JSON.parse(args.jsonString)

    const parsedUDTConfig: UDTConfig = {
      network: rawUDTConfig.network,
      symbol: rawUDTConfig.symbol,
      code_hash: rawUDTConfig.code_hash,
      args: rawUDTConfig.args,
      cellDepSearchKeys: rawUDTConfig.cellDepSearchKeys,
      decimals: rawUDTConfig.decimals,
    }

    let cliConfig = await getCLIConfig(this.config.configDir);
    cliConfig.UDTRegistry[parsedUDTConfig.symbol] = parsedUDTConfig

    this.log(`UDT registered with symbol: ${parsedUDTConfig.symbol}.`);
    this.log(`UDT Config: ${JSON.stringify(parsedUDTConfig)}`);
    await updateCLIConfig(this.config.configDir, cliConfig);
  }
}
