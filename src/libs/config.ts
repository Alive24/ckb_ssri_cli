import {ccc, Cell, CellDep, CellDepLike, ClientJsonRpc, Hex} from '@ckb-ccc/core'
import {ClientCollectableSearchKeyLike} from '@ckb-ccc/core/advancedBarrel'
import path from 'path'
import * as fs from 'fs-extra'
import {Path} from 'jsonfile'

export class UDTConfig {
  code_hash: Hex
  args: Hex
  symbol: string
  decimals: number
  cellDepSearchKeys: ClientCollectableSearchKeyLike[]

  constructor(
    code_hash: Hex,
    args: Hex,
    symbol: string,
    decimals: number,
    cellDepSearchKey: ClientCollectableSearchKeyLike[],
  ) {
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

const pausableUDTCodeCellDepSearchKey: ClientCollectableSearchKeyLike = {
  script: {
    // TypeID
    codeHash: '0x00000000000000000000000000000000000000000000000000545950455f4944',
    hashType: 'type',
    args: '0x2035d31c47fafd6c1ddb50396c5bcd5b76f24539763ef4fca785022855068ca8',
  },
  scriptType: 'type',
  scriptSearchMode: 'exact',
}

const pausableUDTConfig: UDTConfig = {
  code_hash: '0x5fe5d5930122a972819aba74a2efa534522bd326bb146136950095e57a55c9be',
  args: '0xb5202efa0f2d250af66f0f571e4b8be8b272572663707a052907f8760112fe35',
  symbol: 'PUDT',
  decimals: 8,
  cellDepSearchKeys: [pausableUDTCodeCellDepSearchKey],
}

const UDTRegistry: Record<string, UDTConfig> = {
  PUDT: pausableUDTConfig,
}

export function getUDTConfig(symbol: string): UDTConfig {
  return UDTRegistry[symbol]
}

export class CLIConfig {
  UDTRegistry: Record<string, UDTConfig>
  accountRegistry: Record<string, AccountConfig>
  constructor(UDTRegistry: Record<string, UDTConfig>, accountRegistry: Record<string, AccountConfig>) {
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

export async function getCLIConfig(configDir: string): Promise<CLIConfig> {
  let parsedCLIConfig = await fs.readJSON(path.join(configDir, 'ckb_ssri_cli_config.json'))
  const UDTRegistry: Record<string, UDTConfig> = parsedCLIConfig.UDTRegistry || {}
  const accountRegistry: Record<string, AccountConfig> = parsedCLIConfig.accountRegistry || {}

  return new CLIConfig(UDTRegistry, accountRegistry)
}

export async function updateCLIConfig(configDir: string, cliConfig: CLIConfig): Promise<CLIConfig> {
  const configPath = path.join(configDir, 'ckb_ssri_cli_config.json')
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
