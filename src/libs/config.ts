import { ccc, Hex } from "@ckb-ccc/core";
import { ClientCollectableSearchKeyLike } from "@ckb-ccc/core/advancedBarrel";

export class UDTConfig {
  code_hash: Hex;
  args: Hex;
  decimals: number;
  cellDepSearchKey: ClientCollectableSearchKeyLike;

  constructor(code_hash: Hex, args: Hex, decimals: number, cellDepSearchKey: ClientCollectableSearchKeyLike) {
    this.code_hash = code_hash;
    this.args = args;
    this.decimals = decimals;
    this.cellDepSearchKey = cellDepSearchKey;
  }
}


// TODO: Import from ckb-cli.
export class LockScriptConfig {
  code_hash: Hex;
  args: Hex;

  constructor(code_hash: Hex, args: Hex) {
    this.code_hash = code_hash;
    this.args = args;
  }
}

const pausableUDTCellDepSearchKey: ClientCollectableSearchKeyLike = {
  script: {
    // TypeID
    codeHash:
      "0x00000000000000000000000000000000000000000000000000545950455f4944",
    hashType: "type",
    args: "0x2035d31c47fafd6c1ddb50396c5bcd5b76f24539763ef4fca785022855068ca8",
  },
  scriptType: "type",
  scriptSearchMode: "exact",
};

const pausableUDTConfig = new UDTConfig(
  '0x5fe5d5930122a972819aba74a2efa534522bd326bb146136950095e57a55c9be',
  '0xb5202efa0f2d250af66f0f571e4b8be8b272572663707a052907f8760112fe35',
  8,
  pausableUDTCellDepSearchKey
);

export function getUDTConfig(): UDTConfig {
  return pausableUDTConfig;
}