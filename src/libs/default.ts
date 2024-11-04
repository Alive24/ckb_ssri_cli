import {ClientCollectableSearchKeyLike} from '@ckb-ccc/core/advancedBarrel'
import {UDTConfig, AccountConfig} from './config.js'
import 'dotenv/config'

// TODO: This should be an enum of network but ts-config seems not allowing it
export const DefaultRPCRegistry: Record<string, string> = {
  "Mainnet": 'wss://ckb.dev/ws',
  "Testnet": 'wss://testnet.ckb.dev/ws',
}

const TestnetPausableUDTConfig: UDTConfig = {
  network: "Testnet",
  code_hash: '0x5fe5d5930122a972819aba74a2efa534522bd326bb146136950095e57a55c9be',
  args: '0xb5202efa0f2d250af66f0f571e4b8be8b272572663707a052907f8760112fe35',
  symbol: 'PUDT',
  decimals: 8,
  cellDepSearchKeys: [
    {
      script: {
        // TypeID
        codeHash: '0x00000000000000000000000000000000000000000000000000545950455f4944',
        hashType: 'type',
        args: '0x2035d31c47fafd6c1ddb50396c5bcd5b76f24539763ef4fca785022855068ca8',
      },
      scriptType: 'type',
      scriptSearchMode: 'exact',
    },
  ],
}

const TestnetUSDIPausableUDTConfig: UDTConfig = {
  network: "Testnet",
  code_hash: '0xcc9dc33ef234e14bc788c43a4848556a5fb16401a04662fc55db9bb201987037',
  args: '0x71fd1985b2971a9903e4d8ed0d59e6710166985217ca0681437883837b86162f',
  symbol: 'USDI',
  decimals: 6,
  cellDepSearchKeys: [
    {
      script: {
        // TypeID
        codeHash: '0x00000000000000000000000000000000000000000000000000545950455f4944',
        hashType: 'type',
        args: '0xf0bad0541211603bf14946e09ceac920dd7ed4f862f0ffd53d0d477d6e1d0f0b',
      },
      scriptType: 'type',
      scriptSearchMode: 'exact',
    },
  ],
}

export const DefaultUDTRegistry: Record<string, UDTConfig> = {
  PUDT: TestnetPausableUDTConfig,
  USDI: TestnetUSDIPausableUDTConfig,
}

export const DefaultAccountRegistry: Record<string, AccountConfig> = {
  "Main": {
    privateKey: process.env.MAIN_WALLET_PRIVATE_KEY!,
  },
  "Paused": {
    privateKey: process.env.PAUSED_WALLET_PRIVATE_KEY!,
  },
  "TestNormal": {
    privateKey: "d6291986b247f93be1843a091ddaf889c13283fdd07b073e05176566896a74cb",
  }
}
