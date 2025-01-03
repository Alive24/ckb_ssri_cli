import {Args, Command, Flags} from '@oclif/core'
import { getCLIConfig, updateCLIConfig } from '../../../libs/config.js'
import { ccc } from '@ckb-ccc/core'

export default class ConfigAccountImport extends Command {
  static override args = {
    alias: Args.string({description: 'Account Alias; if not provided, will use the address as alias'}),
  }

  static override description = 'Import an account to the CLI config.'

  static override examples = [
    'ckb_ssri_cli config:account:import --private-key <privateKey> [alias]',
  ]

  static override flags = {
    // ISSUE: [Support more ways of authentications and chain to ckb-cli like ckb-cinnabar #18](https://github.com/Alive24/ckb_ssri_cli/issues/18)
    privateKey: Flags.string({char: 'p', description: 'Private Key', required: true}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(ConfigAccountImport)

    let cliConfig = await getCLIConfig(this.config.configDir);
    const client = new ccc.ClientPublicTestnet({url: process.env.CKB_RPC_URL})
    const signer = new ccc.SignerCkbPrivateKey(client, flags.privateKey!)
    const accountRegistryKey = args.alias ?? await signer.getRecommendedAddress();

    cliConfig.accountRegistry[accountRegistryKey] = {
      privateKey: flags.privateKey,
    }

    this.log(`Account imported with alias: ${accountRegistryKey}. The address is ${signer.getRecommendedAddress()}.`);

    await updateCLIConfig(this.config.configDir, cliConfig);
  }
}
