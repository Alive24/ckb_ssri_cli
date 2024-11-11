# ckb_ssri_cli

=================

<!-- toc -->
* [ckb_ssri_cli](#ckb_ssri_cli)
<!-- tocstop -->
## Usage
<!-- usage -->
```sh-session
$ npm install -g ckb_ssri_cli
$ ckb_ssri_cli COMMAND
running command...
$ ckb_ssri_cli (--version)
ckb_ssri_cli/0.0.0 linux-x64 node-v20.9.0
$ ckb_ssri_cli --help [COMMAND]
USAGE
  $ ckb_ssri_cli COMMAND
...
```
<!-- usagestop -->
## Commands
<!-- commands -->
* [`ckb_ssri_cli config account import [ALIAS]`](#ckb_ssri_cli-config-account-import-alias)
* [`ckb_ssri_cli config udt register JSONSTRING`](#ckb_ssri_cli-config-udt-register-jsonstring)
* [`ckb_ssri_cli help [COMMAND]`](#ckb_ssri_cli-help-command)
* [`ckb_ssri_cli plugins`](#ckb_ssri_cli-plugins)
* [`ckb_ssri_cli plugins add PLUGIN`](#ckb_ssri_cli-plugins-add-plugin)
* [`ckb_ssri_cli plugins:inspect PLUGIN...`](#ckb_ssri_cli-pluginsinspect-plugin)
* [`ckb_ssri_cli plugins install PLUGIN`](#ckb_ssri_cli-plugins-install-plugin)
* [`ckb_ssri_cli plugins link PATH`](#ckb_ssri_cli-plugins-link-path)
* [`ckb_ssri_cli plugins remove [PLUGIN]`](#ckb_ssri_cli-plugins-remove-plugin)
* [`ckb_ssri_cli plugins reset`](#ckb_ssri_cli-plugins-reset)
* [`ckb_ssri_cli plugins uninstall [PLUGIN]`](#ckb_ssri_cli-plugins-uninstall-plugin)
* [`ckb_ssri_cli plugins unlink [PLUGIN]`](#ckb_ssri_cli-plugins-unlink-plugin)
* [`ckb_ssri_cli plugins update`](#ckb_ssri_cli-plugins-update)
* [`ckb_ssri_cli udt extended mint SYMBOL TOADDRESS TOAMOUNT`](#ckb_ssri_cli-udt-extended-mint-symbol-toaddress-toamount)
* [`ckb_ssri_cli udt metadata decimals TXHASH INDEX`](#ckb_ssri_cli-udt-metadata-decimals-txhash-index)
* [`ckb_ssri_cli udt metadata name TXHASH INDEX`](#ckb_ssri_cli-udt-metadata-name-txhash-index)
* [`ckb_ssri_cli udt metadata symbol TXHASH INDEX`](#ckb_ssri_cli-udt-metadata-symbol-txhash-index)
* [`ckb_ssri_cli udt pausable enumerate-paused SYMBOL`](#ckb_ssri_cli-udt-pausable-enumerate-paused-symbol)
* [`ckb_ssri_cli udt pausable is-paused SYMBOL [LOCK_HASH]`](#ckb_ssri_cli-udt-pausable-is-paused-symbol-lock_hash)
* [`ckb_ssri_cli udt transfer SYMBOL TOADDRESS TOAMOUNT`](#ckb_ssri_cli-udt-transfer-symbol-toaddress-toamount)

## `ckb_ssri_cli config account import [ALIAS]`

Import an account to the CLI config.

```
USAGE
  $ ckb_ssri_cli config account import [ALIAS] -p <value>

ARGUMENTS
  ALIAS  Account Alias; if not provided, will use the address as alias

FLAGS
  -p, --privateKey=<value>  (required) Private Key

DESCRIPTION
  Import an account to the CLI config.

EXAMPLES
  $ ckb_ssri_cli config:account:import --private-key <privateKey> [alias]
```

_See code: [src/commands/config/account/import.ts](https://github.com/Alive24/ckb_ssri_cli/blob/v0.0.0/src/commands/config/account/import.ts)_

## `ckb_ssri_cli config udt register JSONSTRING`

Register a UDT to the CLI config with JSONString of UDTConfig.

```
USAGE
  $ ckb_ssri_cli config udt register JSONSTRING

ARGUMENTS
  JSONSTRING  JsonString

DESCRIPTION
  Register a UDT to the CLI config with JSONString of UDTConfig.

EXAMPLES
  $ ckb_ssri_cli config:udt:register "{"code_hash":"0x5fe5d5930122a972819aba74a2efa534522bd326bb146136950095e57a55c9be","args":"0xb5202efa0f2d250af66f0f571e4b8be8b272572663707a052907f8760112fe35","symbol":"PUDT","decimals":8,"cellDepSearchKeys":[{"script":{"codeHash":"0x00000000000000000000000000000000000000000000000000545950455f4944","hashType":"type","args":"0x2035d31c47fafd6c1ddb50396c5bcd5b76f24539763ef4fca785022855068ca8"},"scriptType":"type","scriptSearchMode":"exact"}]}"
```

_See code: [src/commands/config/udt/register.ts](https://github.com/Alive24/ckb_ssri_cli/blob/v0.0.0/src/commands/config/udt/register.ts)_

## `ckb_ssri_cli help [COMMAND]`

Display help for ckb_ssri_cli.

```
USAGE
  $ ckb_ssri_cli help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for ckb_ssri_cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.16/src/commands/help.ts)_

## `ckb_ssri_cli plugins`

List installed plugins.

```
USAGE
  $ ckb_ssri_cli plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ ckb_ssri_cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.15/src/commands/plugins/index.ts)_

## `ckb_ssri_cli plugins add PLUGIN`

Installs a plugin into ckb_ssri_cli.

```
USAGE
  $ ckb_ssri_cli plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into ckb_ssri_cli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the CKB_SSRI_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the CKB_SSRI_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ ckb_ssri_cli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ ckb_ssri_cli plugins add myplugin

  Install a plugin from a github url.

    $ ckb_ssri_cli plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ ckb_ssri_cli plugins add someuser/someplugin
```

## `ckb_ssri_cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ ckb_ssri_cli plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ ckb_ssri_cli plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.15/src/commands/plugins/inspect.ts)_

## `ckb_ssri_cli plugins install PLUGIN`

Installs a plugin into ckb_ssri_cli.

```
USAGE
  $ ckb_ssri_cli plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into ckb_ssri_cli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the CKB_SSRI_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the CKB_SSRI_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ ckb_ssri_cli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ ckb_ssri_cli plugins install myplugin

  Install a plugin from a github url.

    $ ckb_ssri_cli plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ ckb_ssri_cli plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.15/src/commands/plugins/install.ts)_

## `ckb_ssri_cli plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ ckb_ssri_cli plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ ckb_ssri_cli plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.15/src/commands/plugins/link.ts)_

## `ckb_ssri_cli plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ ckb_ssri_cli plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ckb_ssri_cli plugins unlink
  $ ckb_ssri_cli plugins remove

EXAMPLES
  $ ckb_ssri_cli plugins remove myplugin
```

## `ckb_ssri_cli plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ ckb_ssri_cli plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.15/src/commands/plugins/reset.ts)_

## `ckb_ssri_cli plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ ckb_ssri_cli plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ckb_ssri_cli plugins unlink
  $ ckb_ssri_cli plugins remove

EXAMPLES
  $ ckb_ssri_cli plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.15/src/commands/plugins/uninstall.ts)_

## `ckb_ssri_cli plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ ckb_ssri_cli plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ckb_ssri_cli plugins unlink
  $ ckb_ssri_cli plugins remove

EXAMPLES
  $ ckb_ssri_cli plugins unlink myplugin
```

## `ckb_ssri_cli plugins update`

Update installed plugins.

```
USAGE
  $ ckb_ssri_cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.15/src/commands/plugins/update.ts)_

## `ckb_ssri_cli udt extended mint SYMBOL TOADDRESS TOAMOUNT`

Mint UDT to an address. Make sure you have the mint permission to the token. It overrides pause list.

```
USAGE
  $ ckb_ssri_cli udt extended mint SYMBOL TOADDRESS TOAMOUNT [--privateKey <value>] [--fromAccount <value>]

ARGUMENTS
  SYMBOL     Symbol of UDT to mint.
  TOADDRESS  file to read
  TOAMOUNT   Amount with decimals. e.g. 1 USDT would be 1 instead of 100000000

FLAGS
  --fromAccount=<value>  Use specific account to sign. Will use MAIN_WALLET_PRIVATE_KEY from .env by default.
  --privateKey=<value>   Use specific private key to sign. Will use MAIN_WALLET_PRIVATE_KEY from .env by default.

DESCRIPTION
  Mint UDT to an address. Make sure you have the mint permission to the token. It overrides pause list.

EXAMPLES
  $ ckb_ssri_cli udt:extended:mint PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqgtlcnzzna2tqst7jw78egjpujn7hdxpackjmmdp 100
```

_See code: [src/commands/udt/extended/mint.ts](https://github.com/Alive24/ckb_ssri_cli/blob/v0.0.0/src/commands/udt/extended/mint.ts)_

## `ckb_ssri_cli udt metadata decimals TXHASH INDEX`

Return the decimals of the UDT cell. Will automatically route to the script cell for direct calling.

```
USAGE
  $ ckb_ssri_cli udt metadata decimals TXHASH INDEX

ARGUMENTS
  TXHASH  txHash of the UDT cell (Note: Not the script cell).
  INDEX   index of the UDT cell (Note: Not the script cell).

DESCRIPTION
  Return the decimals of the UDT cell. Will automatically route to the script cell for direct calling.

EXAMPLES
  $ ckb_ssri_cli udt:metadata:decimals 0x5a68061c57b753c941919e42d74254f878ae2786387e42c1b835980443cb5cc8 0
```

_See code: [src/commands/udt/metadata/decimals.ts](https://github.com/Alive24/ckb_ssri_cli/blob/v0.0.0/src/commands/udt/metadata/decimals.ts)_

## `ckb_ssri_cli udt metadata name TXHASH INDEX`

Return the name of the UDT cell. Will automatically route to the script cell for direct calling.

```
USAGE
  $ ckb_ssri_cli udt metadata name TXHASH INDEX

ARGUMENTS
  TXHASH  txHash of the UDT cell (Note: Not the script cell).
  INDEX   index of the UDT cell (Note: Not the script cell).

DESCRIPTION
  Return the name of the UDT cell. Will automatically route to the script cell for direct calling.

EXAMPLES
  $ ckb_ssri_cli udt:metadata:name 0x5a68061c57b753c941919e42d74254f878ae2786387e42c1b835980443cb5cc8 0
```

_See code: [src/commands/udt/metadata/name.ts](https://github.com/Alive24/ckb_ssri_cli/blob/v0.0.0/src/commands/udt/metadata/name.ts)_

## `ckb_ssri_cli udt metadata symbol TXHASH INDEX`

Return the symbol of the UDT cell. Will automatically route to the script cell for direct calling.

```
USAGE
  $ ckb_ssri_cli udt metadata symbol TXHASH INDEX

ARGUMENTS
  TXHASH  txHash of the UDT cell (Note: Not the script cell).
  INDEX   index of the UDT cell (Note: Not the script cell).

DESCRIPTION
  Return the symbol of the UDT cell. Will automatically route to the script cell for direct calling.

EXAMPLES
  $ ckb_ssri_cli udt:metadata:symbol 0x5a68061c57b753c941919e42d74254f878ae2786387e42c1b835980443cb5cc8 0
```

_See code: [src/commands/udt/metadata/symbol.ts](https://github.com/Alive24/ckb_ssri_cli/blob/v0.0.0/src/commands/udt/metadata/symbol.ts)_

## `ckb_ssri_cli udt pausable enumerate-paused SYMBOL`

Enumerate the pause list of the token. Note: This command should be transaction level if using external pause list.

```
USAGE
  $ ckb_ssri_cli udt pausable enumerate-paused SYMBOL... [--target <value>] [--index <value>] [-l code|cell|transaction]

ARGUMENTS
  SYMBOL...  Symbol of UDT to mint.

FLAGS
  -l, --level=<option>  [default: code] name to print
                        <options: code|cell|transaction>
      --index=<value>   Index of the target cell
      --target=<value>  Target cell

DESCRIPTION
  Enumerate the pause list of the token. Note: This command should be transaction level if using external pause list.

EXAMPLES
  ckb_ssri_sli udt:pausable:enumerate-paused PUDT
```

_See code: [src/commands/udt/pausable/enumerate-paused.ts](https://github.com/Alive24/ckb_ssri_cli/blob/v0.0.0/src/commands/udt/pausable/enumerate-paused.ts)_

## `ckb_ssri_cli udt pausable is-paused SYMBOL [LOCK_HASH]`

Inspect an array of specific lock hashes to see if any one of they are paused. Note that this command is transaction specific if using external pause list.

```
USAGE
  $ ckb_ssri_cli udt pausable is-paused SYMBOL... [LOCK_HASH...] [--target <value>] [--index <value>] [-l
    code|cell|transaction]

ARGUMENTS
  SYMBOL...     Symbol of UDT to mint.
  LOCK_HASH...  Lock hash in hex. Variable length

FLAGS
  -l, --level=<option>  [default: code] name to print
                        <options: code|cell|transaction>
      --index=<value>   Index of the target cell
      --target=<value>  Target cell

DESCRIPTION
  Inspect an array of specific lock hashes to see if any one of they are paused. Note that this command is transaction
  specific if using external pause list.

EXAMPLES
  ckb_ssri_sli udt:pausable:is-paused PUDT 0xd19228c64920eb8c3d79557d8ae59ee7a14b9d7de45ccf8bafacf82c91fc359e
```

_See code: [src/commands/udt/pausable/is-paused.ts](https://github.com/Alive24/ckb_ssri_cli/blob/v0.0.0/src/commands/udt/pausable/is-paused.ts)_

## `ckb_ssri_cli udt transfer SYMBOL TOADDRESS TOAMOUNT`

Transfer UDT to an address.

```
USAGE
  $ ckb_ssri_cli udt transfer SYMBOL TOADDRESS TOAMOUNT [--privateKey <value>] [-f <value>] [--fromTransactionJson
    <value>] [--holdSend]

ARGUMENTS
  SYMBOL     Symbol of UDT to transfer.
  TOADDRESS  file to read
  TOAMOUNT   Amount with decimals. e.g. 1 USDT would be 1 instead of 100000000. You can transfer amount like 0.1.

FLAGS
  -f, --fromAccount=<value>          Use specific account to sign. Will use MAIN_WALLET_PRIVATE_KEY from .env by
                                     default.
      --fromTransactionJson=<value>  Assemble transaction on the basis of a previous action; use together with holdSend
                                     to make multiple transfers within the same transaction.
      --holdSend                     Hold the transaction and send it later. Will output the transaction JSON. Use
                                     together with fromTransactionJson to make multiple transfers within the same
                                     transaction.
      --privateKey=<value>           Use specific private key to sign. Will use MAIN_WALLET_PRIVATE_KEY from .env by
                                     default.

DESCRIPTION
  Transfer UDT to an address.

EXAMPLES
  $ ckb_ssri_cli udt:transfer PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqgtlcnzzna2tqst7jw78egjpujn7hdxpackjmmdp 100
```

_See code: [src/commands/udt/transfer.ts](https://github.com/Alive24/ckb_ssri_cli/blob/v0.0.0/src/commands/udt/transfer.ts)_
<!-- commandsstop -->

### UDTPausable.is_paused

```shell
ckb_ssri_cli udt:pausable:is-paused PUDT 0xd19228c64920eb8c3d79557d8ae59ee7a14b9d7de45ccf8bafacf82c91fc359e
```

### UDTPausable.enumerate_paused

```shell
ckb_ssri_cli udt:pausable:enumerate-paused PUDT
```

### UDTExtended.mint

```shell
ckb_ssri_cli udt:extended:mint PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqg7mkruq9gwjdxsgpw8yzmlvzecsqafcysjyrveq 100
// NOTE: This is a paused address, but minting will override.
ckb_ssri_cli udt:extended:mint PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqgtlcnzzna2tqst7jw78egjpujn7hdxpackjmmdp 100
// NOTE: This won't mint as TestNormal is not owner.
ckb_ssri_cli udt:extended:mint PUDT --fromAccount=TestNormal ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqgtlcnzzna2tqst7jw78egjpujn7hdxpackjmmdp 100
```

### UDT.transfer

```shell
// Note: This will succeed as transferring as owner overrides despite transferring to paused address.
ckb_ssri_cli udt:transfer PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqgtlcnzzna2tqst7jw78egjpujn7hdxpackjmmdp 100

// Note: This will succeed as transferring to non-paused address from normal address.
ckb_ssri_cli udt:transfer --fromAccount=TestNormal PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqg7mkruq9gwjdxsgpw8yzmlvzecsqafcysjyrveq 100

// Note: This will fail as transferring from paused address.
ckb_ssri_cli udt:transfer --fromAccount=Paused PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqg7mkruq9gwjdxsgpw8yzmlvzecsqafcysjyrveq 100

// Note: This will fail as transferring to paused address.
ckb_ssri_cli udt:transfer --fromAccount=TestNormal PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqgtlcnzzna2tqst7jw78egjpujn7hdxpackjmmdp 100

```

### UDTMetadata.name
  
```shell
ckb_ssri_cli udt:metadata:name 0x5a68061c57b753c941919e42d74254f878ae2786387e42c1b835980443cb5cc8 0
```
