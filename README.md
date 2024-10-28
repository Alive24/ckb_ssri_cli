ckb_ssri_cli
=================

A new CLI generated with oclif


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ckb_ssri_cli.svg)](https://npmjs.org/package/ckb_ssri_cli)
[![Downloads/week](https://img.shields.io/npm/dw/ckb_ssri_cli.svg)](https://npmjs.org/package/ckb_ssri_cli)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
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
# Commands
<!-- commands -->
* [`ckb_ssri_cli hello PERSON`](#ckb_ssri_cli-hello-person)
* [`ckb_ssri_cli hello world`](#ckb_ssri_cli-hello-world)
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

## `ckb_ssri_cli hello PERSON`

Say hello

```
USAGE
  $ ckb_ssri_cli hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ ckb_ssri_cli hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/Alive24/ckb_ssri_cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `ckb_ssri_cli hello world`

Say hello world

```
USAGE
  $ ckb_ssri_cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ ckb_ssri_cli hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/Alive24/ckb_ssri_cli/blob/v0.0.0/src/commands/hello/world.ts)_

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
<!-- commandsstop -->
