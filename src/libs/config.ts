import {ccc, Cell, CellDep, CellDepLike, ClientJsonRpc, Hex} from '@ckb-ccc/core'
import {ClientCollectableSearchKeyLike} from '@ckb-ccc/core/advancedBarrel'
import path from 'path'
import fs from 'fs-extra'
import {Path} from 'jsonfile'
import { DefaultAccountRegistry, DefaultRPCRegistry, DefaultUDTRegistry } from './default.js'

// TODO: This should be an enum of network but ts-config of this repo seems not allowing using it in another file (i.e, not importing Network properly). Should fix in the future.
enum Network {
  Mainnet = "Mainnet",
  Testnet = "Testnet",
}

export default Network;

export class UDTConfig {
  // network: Network
  network: string
  code_hash: Hex
  args: Hex
  symbol: string
  decimals: number
  cellDepSearchKeys: ClientCollectableSearchKeyLike[]

  constructor(
    network: Network,
    code_hash: Hex,
    args: Hex,
    symbol: string,
    decimals: number,
    cellDepSearchKey: ClientCollectableSearchKeyLike[],
  ) {
    this.network = network
    this.code_hash = code_hash
    this.args = args
    this.symbol = symbol
    this.decimals = decimals
    this.cellDepSearchKeys = cellDepSearchKey
  }
}

// TODO: Import from ckb-cli.
export class LockScriptConfig {
  code_hash: Hex
  args: Hex

  constructor(code_hash: Hex, args: Hex) {
    this.code_hash = code_hash
    this.args = args
  }
}

export class CLIConfig {
  RPCRegistry: Record<string, string>
  UDTRegistry: Record<string, UDTConfig>
  accountRegistry: Record<string, AccountConfig>
  constructor(
    RPCRegistry: Record<string, string>,
    UDTRegistry: Record<string, UDTConfig>,
    accountRegistry: Record<string, AccountConfig>,
  ) {
    this.RPCRegistry = RPCRegistry
    this.UDTRegistry = UDTRegistry
    this.accountRegistry = accountRegistry
  }
}

export class AccountConfig {
  // TODO: Make this approach more secure. Maybe chain it to ckb-cli like ckb-cinnabar
  privateKey: string

  constructor(privateKey: string) {
    this.privateKey = privateKey
  }
}

export async function getCLIConfig(configDir?: string): Promise<CLIConfig> {
  let parsedCLIConfig
  if (!configDir) {
    parsedCLIConfig = undefined
  } else {
    parsedCLIConfig = await fs.readJSON(path.join(configDir, 'ckb_ssri_cli_config.json')).catch(() => undefined)
  }
  const RPCRegistry: Record<string, string> = parsedCLIConfig?.RPCRegistry ?? DefaultRPCRegistry
  const UDTRegistry: Record<string, UDTConfig> = parsedCLIConfig?.UDTRegistry ?? DefaultUDTRegistry
  const accountRegistry: Record<string, AccountConfig> = parsedCLIConfig?.accountRegistry ?? DefaultAccountRegistry

  return new CLIConfig(RPCRegistry, UDTRegistry, accountRegistry)
}

export async function updateCLIConfig(configDir: string, cliConfig: CLIConfig): Promise<CLIConfig> {
  const configPath = path.join(configDir, 'ckb_ssri_cli_config.json')

  await fs.ensureDir(configDir);
  
  await fs.writeJSON(configPath, cliConfig, {spaces: 2})
  return cliConfig
}

export async function getCellDepsFromSearchKeys(
  client: ClientJsonRpc,
  searchKeys: ClientCollectableSearchKeyLike[],
): Promise<CellDepLike[]> {
  const cellDepsLike: CellDepLike[] = []
  for (const searchKey of searchKeys) {
    const findCellDepResult = await client.findCells(searchKey).next()
    const cellDepCell: Cell = findCellDepResult.value
    const cellDepLike: CellDepLike = {
      outPoint: {
        txHash: cellDepCell.outPoint.txHash,
        index: cellDepCell.outPoint.index,
      },
      depType: 'code',
    }
    cellDepsLike.push(cellDepLike)
  }
  return cellDepsLike
}
